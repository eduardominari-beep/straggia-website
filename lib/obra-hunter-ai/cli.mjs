#!/usr/bin/env node
import { runPipeline } from "./core/engine.mjs";
import { CITY_CONFIG } from "./config/cities.mjs";

function parseArg(name, fallback = undefined) {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (!arg) return fallback;
  return arg.split("=").slice(1).join("=");
}

async function main() {
  const command = process.argv[2] ?? "run";
  const cityArg = parseArg("cities", "sao-paulo");
  const cityKeys = cityArg === "all-gsp" ? Object.keys(CITY_CONFIG) : cityArg.split(",").map((c) => c.trim());
  const minScore = Number(parseArg("min-score", "35"));

  if (command === "run") {
    const result = await runPipeline({ cityKeys, minScore });
    console.log(JSON.stringify({ ok: true, runId: result.runId, runDir: result.runDir, leads: result.leads.length, outputs: result.outputs }, null, 2));
    return;
  }

  if (command === "weekly") {
    const result = await runPipeline({ cityKeys, minScore });
    console.log(JSON.stringify({ ok: true, weekly: true, runId: result.runId, top: result.leads.slice(0, 20) }, null, 2));
    return;
  }

  throw new Error(`Comando inválido: ${command}`);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
