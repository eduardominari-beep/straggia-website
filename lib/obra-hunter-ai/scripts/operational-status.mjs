#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const runsRoot = path.resolve("lib/obra-hunter-ai/data/runs");

function parseArg(name) {
  const pref = `--${name}=`;
  const v = process.argv.find((x) => x.startsWith(pref));
  return v ? v.slice(pref.length) : null;
}

async function loadRun(runId) {
  const runDir = path.join(runsRoot, runId);
  const diagnostics = JSON.parse(await readFile(path.join(runDir, "diagnostics.json"), "utf-8"));
  const ranking = JSON.parse(await readFile(path.join(runDir, "ranking-semanal.json"), "utf-8"));
  const connectors = JSON.parse(await readFile(path.join(runDir, "connectors.json"), "utf-8"));
  return { runId, runDir, diagnostics, ranking, connectors };
}

function buildExecutiveSummary(run) {
  const connectors = run.connectors.map((c) => ({
    name: `${c.connector}:${c.cityKey}`,
    ok: c.ok,
    records: c.recordsCollected ?? (c.signals?.length ?? 0),
    mode: c.mode ?? "live",
    error: c.error ?? c.liveError ?? null,
  }));

  const okSources = connectors.filter((c) => c.ok && c.records > 0);
  const failedSources = connectors.filter((c) => !c.ok);
  const topLeads = (run.ranking.leads ?? []).slice(0, 5).map((l) => `${l.city} | score ${l.score} | ${l.probableWorkType}`);

  return {
    runId: run.runId,
    leadsTotal: run.ranking.leads?.length ?? 0,
    sourcesOk: okSources,
    sourcesFailed: failedSources,
    topLeads,
  };
}

async function getLatestRunId() {
async function main() {
  const dirs = (await readdir(runsRoot, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (!dirs.length) throw new Error("no_run_artifacts");
  return dirs[dirs.length - 1];
}

async function main() {
  const runIdArg = parseArg("run-id");
  const previousRunIdArg = parseArg("previous-run-id");

  const runId = runIdArg ?? (await getLatestRunId());
  const latest = await loadRun(runId);
  const previous = previousRunIdArg ? await loadRun(previousRunIdArg) : null;

  const latest = await loadRun(dirs[dirs.length - 1]);
  const previous = dirs.length >= 2 ? await loadRun(dirs[dirs.length - 2]) : null;

  const summary = buildExecutiveSummary(latest);

  const warnings = [];
  if (summary.sourcesFailed.length > 0) warnings.push("one_or_more_connectors_failed");

  if (previous && previous.diagnostics.allowFixtureFallback === false && latest.diagnostics.allowFixtureFallback === true) {
    const liveLeads = previous.ranking.leads?.length ?? 0;
    const fallbackLeads = latest.ranking.leads?.length ?? 0;
    if (fallbackLeads > liveLeads) warnings.push("live_below_fallback");
  }

  const hardFailReasons = [];
  if (!latest.ranking || !Array.isArray(latest.ranking.leads)) hardFailReasons.push("ranking_missing");
  if (!latest.connectors || latest.connectors.length === 0) hardFailReasons.push("no_connectors_recorded");
  if (summary.sourcesOk.length === 0) hardFailReasons.push("no_useful_source_responded");

  const status = hardFailReasons.length > 0 ? "FAIL" : "SUCCESS";

  const report = {
    status,
    warnings,
    hardFailReasons,
    summary,
  };

  const reportPath = path.join(latest.runDir, "operational-status.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));

  const markdown = [
    `# Operational Status: ${status}`,
    "",
    `- runId: ${summary.runId}`,
    `- leads totais: ${summary.leadsTotal}`,
    `- fontes OK: ${summary.sourcesOk.length}`,
    `- fontes falharam: ${summary.sourcesFailed.length}`,
    warnings.length ? `- warnings: ${warnings.join(", ")}` : "- warnings: none",
    hardFailReasons.length ? `- fail reasons: ${hardFailReasons.join(", ")}` : "- fail reasons: none",
    "",
    "## Top Leads",
    ...summary.topLeads.map((x) => `- ${x}`),
  ].join("\n");

  const mdPath = path.join(latest.runDir, "operational-status.md");
  await writeFile(mdPath, markdown, "utf-8");

  console.log(JSON.stringify({ ...report, reportPath, mdPath }, null, 2));

  if (status === "FAIL") process.exit(1);
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "FAIL", error: String(error) }, null, 2));
  process.exit(1);
});
