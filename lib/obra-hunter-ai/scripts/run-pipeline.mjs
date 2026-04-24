#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { runPipeline } from "../core/engine.mjs";
import { CITY_CONFIG } from "../config/cities.mjs";

function parseArg(name, fallback = undefined) {
  const pref = `--${name}=`;
  const arg = process.argv.find((a) => a.startsWith(pref));
  return arg ? arg.slice(pref.length) : fallback;
}

function resolveCityKeys(citiesArg) {
  if (!citiesArg || citiesArg === "all-gsp") return Object.keys(CITY_CONFIG);
  return citiesArg.split(",").map((c) => c.trim()).filter(Boolean);
}

async function main() {
  const mode = parseArg("mode", "live");
  const cityKeys = resolveCityKeys(parseArg("cities", "all-gsp"));
  const minScore = Number(parseArg("min-score", "35"));
  const resultFile = parseArg("result-file", null);

  if (!Number.isFinite(minScore)) {
    throw new Error("invalid_min_score");
  }

  if (mode === "fallback") {
    process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK = "1";
  } else {
    process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK = "0";
  }

  const result = await runPipeline({ cityKeys, minScore });
  const payload = {
    mode,
    runId: result.runId,
    runDir: result.runDir,
    leads: result.leads.length,
    cities: cityKeys,
    minScore,
  };

  if (resultFile) {
    await writeFile(resultFile, JSON.stringify(payload, null, 2), "utf-8");
  }

  console.log(JSON.stringify(payload, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
