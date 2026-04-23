import test from "node:test";
import assert from "node:assert/strict";
import { runBarueriPcaConnector } from "../connectors/barueri-pca.mjs";

test("barueri connector usa fixture apenas com fallback explícito", async () => {
  const out = await runBarueriPcaConnector({ runId: "test-run", allowFixtureFallback: true });
  assert.equal(out.ok, true);
  assert.equal(out.mode, "fixture-fallback");
  assert.ok(out.signals.length >= 10);
});
