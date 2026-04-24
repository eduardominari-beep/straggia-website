#!/usr/bin/env node
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runsRoot = path.resolve("lib/obra-hunter-ai/data/runs");

function parseArg(name, fallback = null) {
  const pref = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(pref));
  return arg ? arg.slice(pref.length) : fallback;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const runId = parseArg("run-id");
  const fallbackRunId = parseArg("fallback-run-id");

  if (!runId) {
    throw new Error("run_id_is_required");
  }

  const runDir = path.join(runsRoot, runId);
  const rankingPath = path.join(runDir, "ranking-semanal.json");
  const connectorsPath = path.join(runDir, "connectors.json");
  const diagnosticsPath = path.join(runDir, "diagnostics.json");

  const requiredArtifacts = [rankingPath, connectorsPath, diagnosticsPath];
  const missingArtifacts = [];
  for (const artifactPath of requiredArtifacts) {
    if (!(await exists(artifactPath))) {
      missingArtifacts.push(path.basename(artifactPath));
    }
  }

  const warnings = [];
  const hardFailReasons = [];

  if (missingArtifacts.length > 0) {
    hardFailReasons.push(`missing_artifacts:${missingArtifacts.join(",")}`);
  }

  let leads = [];
  let connectors = [];
  if (hardFailReasons.length === 0) {
    const ranking = JSON.parse(await readFile(rankingPath, "utf-8"));
    connectors = JSON.parse(await readFile(connectorsPath, "utf-8"));
    leads = ranking.leads ?? [];

    if (!Array.isArray(leads)) {
      hardFailReasons.push("ranking_invalid");
    }

    if (!Array.isArray(connectors) || connectors.length === 0) {
      hardFailReasons.push("no_connectors_recorded");
    }
  }

  const usefulSources = connectors.filter((c) => {
    const records = c.recordsCollected ?? (c.signals?.length ?? 0);
    return c.ok && records > 0;
  });

  if (hardFailReasons.length === 0 && usefulSources.length === 0) {
    hardFailReasons.push("no_useful_source_responded");
  }

  const failedConnectors = connectors.filter((c) => !c.ok);
  if (failedConnectors.length > 0) {
    warnings.push("one_or_more_connectors_failed");
  }

  if (fallbackRunId) {
    const fallbackRankingPath = path.join(runsRoot, fallbackRunId, "ranking-semanal.json");
    if (await exists(fallbackRankingPath)) {
      const fallbackRanking = JSON.parse(await readFile(fallbackRankingPath, "utf-8"));
      const fallbackLeads = fallbackRanking.leads ?? [];
      if (Array.isArray(fallbackLeads) && Array.isArray(leads) && leads.length < fallbackLeads.length) {
        warnings.push("live_below_fallback");
      }
    } else {
      warnings.push("fallback_run_missing_for_comparison");
    }
  }

  let status = "SUCCESS";
  if (hardFailReasons.length > 0) {
    status = "FAIL";
  } else if (warnings.length > 0) {
    status = "WARNING";
  }

  const report = {
    status,
    runId,
    fallbackRunId: fallbackRunId ?? null,
    leadsTotal: Array.isArray(leads) ? leads.length : 0,
    usefulSources: usefulSources.length,
    failedSources: failedConnectors.length,
    warnings,
    hardFailReasons,
  };

  const reportPath = path.join(runDir, "operational-status.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2), "utf-8");

  const markdown = [
    `# Operational Status: ${status}`,
    "",
    `- run_id: ${runId}`,
    `- fallback_run_id: ${fallbackRunId ?? "none"}`,
    `- leads_total: ${report.leadsTotal}`,
    `- useful_sources: ${report.usefulSources}`,
    `- failed_sources: ${report.failedSources}`,
    warnings.length ? `- warnings: ${warnings.join(", ")}` : "- warnings: none",
    hardFailReasons.length ? `- fail_reasons: ${hardFailReasons.join(", ")}` : "- fail_reasons: none",
  ].join("\n");

  const mdPath = path.join(runDir, "operational-status.md");
  await writeFile(mdPath, markdown, "utf-8");

  console.log(JSON.stringify({ ...report, reportPath, mdPath }, null, 2));

  if (status === "FAIL") process.exit(1);
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "FAIL", error: String(error) }, null, 2));
  process.exit(1);
});
