import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runPipeline } from "../core/engine.mjs";

test("runPipeline gera ranking útil com fallback explícito habilitado", async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), "obra-hunter-"));
  try {
    process.env.GEOSAMPA_WFS_URL = "http://127.0.0.1:9/unreachable";
    process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK = "1";
    const result = await runPipeline({ cityKeys: ["sao-paulo", "barueri", "osasco"], outDir: tmp, minScore: 35 });
    assert.ok(result.runDir.includes(tmp));
    assert.ok(result.leads.length >= 10);
  } finally {
    delete process.env.GEOSAMPA_WFS_URL;
    delete process.env.OBRA_HUNTER_ENABLE_FIXTURE_FALLBACK;
    await rm(tmp, { recursive: true, force: true });
  }
});
