#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runsRoot = path.resolve("lib/obra-hunter-ai/data/runs");

function parseArg(name, fallback = null) {
  const pref = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(pref));
  return arg ? arg.slice(pref.length) : fallback;
}

async function main() {
  const runId = parseArg("run-id");
  const comparePath = parseArg("compare-path");
  const outPath = parseArg("out");

  if (!runId) {
    throw new Error("run_id_is_required");
  }

  const runDir = path.join(runsRoot, runId);
  const diagnostics = JSON.parse(await readFile(path.join(runDir, "diagnostics.json"), "utf-8"));
  const connectors = JSON.parse(await readFile(path.join(runDir, "connectors.json"), "utf-8"));
  const ranking = JSON.parse(await readFile(path.join(runDir, "ranking-semanal.json"), "utf-8"));
  const compare = comparePath ? JSON.parse(await readFile(comparePath, "utf-8")) : null;

  const sourceStatus = connectors.map((c) => ({
    connector: c.connector,
    cityKey: c.cityKey,
    ok: c.ok,
    mode: c.mode ?? "live",
    records: c.recordsCollected ?? (c.signals?.length ?? 0),
    error: c.error ?? c.liveError ?? null,
  }));

  const okSources = sourceStatus.filter((s) => s.ok && s.records > 0);
  const failedSources = sourceStatus.filter((s) => !s.ok);

  const topLeads = (ranking.leads ?? []).slice(0, 5).map((l) =>
    `- ${l.city} | score ${l.score} | ${l.probableWorkType} | ${l.source}`,
  );

  const warnings = [];
  if (failedSources.length > 0) warnings.push("one_or_more_connectors_failed");
  if (compare?.liveBelowFallback) warnings.push("live_below_fallback");

  const markdown = [
    "# Executive Summary (FASE A)",
    "",
    `- run_id: ${runId}`,
    `- leads_total: ${(ranking.leads ?? []).length}`,
    `- fontes_ok: ${okSources.length}`,
    `- fontes_com_falha: ${failedSources.length}`,
    `- allow_fixture_fallback: ${Boolean(diagnostics.allowFixtureFallback)}`,
    warnings.length ? `- warnings: ${warnings.join(", ")}` : "- warnings: none",
    compare
      ? `- compare_live_vs_fallback: live=${compare.live.runId} (${compare.live.leads}) vs fallback=${compare.fallback.runId} (${compare.fallback.leads})`
      : "- compare_live_vs_fallback: not_provided",
    "",
    "## Top leads",
    ...(topLeads.length ? topLeads : ["- none"]),
  ].join("\n");

  if (outPath) {
    await writeFile(outPath, markdown, "utf-8");
  }

  console.log(markdown);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
