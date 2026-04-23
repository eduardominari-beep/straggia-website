import path from "node:path";
import { runGeosampaConnector } from "../connectors/geosampa.mjs";
import { runBarueriPcaConnector } from "../connectors/barueri-pca.mjs";
import { runLicitacoesMonitorConnector } from "../connectors/licitacoes-monitor.mjs";
import { normalizeSignal } from "./normalize.mjs";
import { dedupeLeads } from "./dedupe.mjs";
import { applyEligibility } from "./eligibility.mjs";
import { persistRunArtifacts } from "./storage.mjs";
import { writeOutputs } from "../outputs/exporters.mjs";
import { createLogger } from "./logger.mjs";
import { notifyEmail, notifyTelegram } from "../alerts/notifiers.mjs";

const logger = createLogger("engine");

export async function runPipeline({ cityKeys = ["sao-paulo"], outDir = path.resolve("lib/obra-hunter-ai/data/runs"), minScore = 35 } = {}) {
  const runId = new Date().toISOString().replace(/[.:]/g, "-");
  const allowFixtureFallback = process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK === "1";
  logger.info("Starting run", { runId, cityKeys, minScore, allowFixtureFallback });

  const connectorRuns = [];
  for (const cityKey of cityKeys) {
    connectorRuns.push(await runGeosampaConnector({ cityKey }));
  }

  if (cityKeys.includes("barueri")) {
    connectorRuns.push(await runBarueriPcaConnector({ runId, allowFixtureFallback }));
  }

  connectorRuns.push(await runLicitacoesMonitorConnector({ runId, allowFixtureFallback }));

  const rawSignals = connectorRuns.flatMap((run) => run.signals ?? []);
  const normalized = rawSignals.map(normalizeSignal);
  const deduped = dedupeLeads(normalized);
  const eligibility = applyEligibility(deduped, { minScore });
  const ranked = eligibility.eligible.sort((a, b) => b.score - a.score);

  logger.info("Eligibility summary", {
    rawSignals: rawSignals.length,
    normalized: normalized.length,
    deduped: deduped.length,
    eligible: eligibility.stats.eligible,
    discardedByScore: eligibility.stats.discardedByScore,
    minScore,
  });

  const runDir = await persistRunArtifacts({
    outDir,
    runId,
    leads: ranked,
    connectorRuns,
    diagnostics: {
      eligibility: eligibility.stats,
      allowFixtureFallback,
      discarded: eligibility.discarded.map((d) => ({ documentId: d.lead.documentId, reason: d.reason, score: d.lead.score })),
      sourceHealth: connectorRuns.map((r) => ({ connector: r.connector, ok: r.ok, mode: r.mode ?? "live" })),
    },
  });

  const runMeta = {
    executedAt: new Date().toISOString(),
    cities: cityKeys,
    connectorRuns: connectorRuns.length,
    eligibility: eligibility.stats,
  };

  const outputs = await writeOutputs({ runDir, leads: ranked, runMeta });

  await Promise.all([
    notifyEmail({ enabled: process.env.ALERT_EMAIL_ENABLED === "1", logger, summary: runMeta }),
    notifyTelegram({ enabled: process.env.ALERT_TELEGRAM_ENABLED === "1", logger, summary: runMeta }),
  ]);

  logger.info("Run completed", { runId, runDir, leads: ranked.length });

  return { runId, runDir, runMeta, leads: ranked, connectorRuns, outputs, eligibility };
}
