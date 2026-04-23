#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { runPipeline } from "../core/engine.mjs";

function parseArg(name) {
  const pref = `--${name}=`;
  const v = process.argv.find((x) => x.startsWith(pref));
  return v ? v.slice(pref.length) : null;
}

async function main() {
  const cityKeys = ["sao-paulo", "guarulhos", "osasco", "barueri"];
  const outPath = parseArg("out");

  delete process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK;
  const live = await runPipeline({ cityKeys, minScore: 35 });

  process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK = "1";
  const fallback = await runPipeline({ cityKeys, minScore: 35 });

  const report = {
    ts: new Date().toISOString(),
    live: {
      runId: live.runId,
      leads: live.leads.length,
      runDir: live.runDir,
    },
    fallback: {
      runId: fallback.runId,
      leads: fallback.leads.length,
      runDir: fallback.runDir,
    },
    deltaLeads: fallback.leads.length - live.leads.length,
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
