import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function persistRunArtifacts({ outDir, runId, leads, connectorRuns, diagnostics = {} }) {
  const runDir = path.join(outDir, runId);
  await mkdir(runDir, { recursive: true });

  await writeFile(path.join(runDir, "leads.json"), JSON.stringify(leads, null, 2), "utf-8");
  await writeFile(path.join(runDir, "connectors.json"), JSON.stringify(connectorRuns, null, 2), "utf-8");
  await writeFile(path.join(runDir, "diagnostics.json"), JSON.stringify(diagnostics, null, 2), "utf-8");

  return runDir;
}
