#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const runsRoot = path.resolve("lib/obra-hunter-ai/data/runs");

async function main() {
  const dirs = (await readdir(runsRoot, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (!dirs.length) throw new Error("No run directories found");
  const runId = dirs[dirs.length - 1];
  const runDir = path.join(runsRoot, runId);

  const diagnostics = JSON.parse(await readFile(path.join(runDir, "diagnostics.json"), "utf-8"));
  const connectors = JSON.parse(await readFile(path.join(runDir, "connectors.json"), "utf-8"));
  const ranking = JSON.parse(await readFile(path.join(runDir, "ranking-semanal.json"), "utf-8"));

  const sourceStatus = connectors.map((c) => ({
    connector: c.connector,
    cityKey: c.cityKey,
    ok: c.ok,
    mode: c.mode ?? "live",
    records: c.recordsCollected ?? (c.signals?.length ?? 0),
    error: c.error ?? c.liveError ?? null,
  }));

  const summary = {
    runId,
    leads: ranking.leads.length,
    allowFixtureFallback: diagnostics.allowFixtureFallback,
    sourceStatus,
  };

  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
