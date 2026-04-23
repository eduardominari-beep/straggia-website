#!/usr/bin/env node
import { runPipeline } from "../core/engine.mjs";

async function main() {
  const cityKeys = ["sao-paulo", "guarulhos", "osasco", "barueri"];

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

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
