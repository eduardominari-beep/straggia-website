#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runsRoot = path.resolve("lib/obra-hunter-ai/data/runs");

function parseArg(name, fallback = null) {
  const pref = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(pref));
  return arg ? arg.slice(pref.length) : fallback;
}

async function readRanking(runId) {
  const rankingPath = path.join(runsRoot, runId, "ranking-semanal.json");
  const ranking = JSON.parse(await readFile(rankingPath, "utf-8"));
  return { runId, leads: ranking.leads ?? [], rankingPath };
}

async function main() {
  const liveRunId = parseArg("live-run-id");
  const fallbackRunId = parseArg("fallback-run-id");
  const outPath = parseArg("out");

  if (!liveRunId || !fallbackRunId) {
    throw new Error("missing_required_run_ids");
  }

  const live = await readRanking(liveRunId);
  const fallback = await readRanking(fallbackRunId);

  const report = {
    ts: new Date().toISOString(),
    base: "explicit_run_ids",
    live: { runId: live.runId, leads: live.leads.length },
    fallback: { runId: fallback.runId, leads: fallback.leads.length },
    deltaLeads: live.leads.length - fallback.leads.length,
    liveBelowFallback: live.leads.length < fallback.leads.length,
  };

  if (outPath) {
    await writeFile(outPath, JSON.stringify(report, null, 2), "utf-8");
  }

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
