import test from "node:test";
import assert from "node:assert/strict";
import { runLicitacoesMonitorConnector } from "../connectors/licitacoes-monitor.mjs";

test("licitacoes monitor gera sinais com fallback explícito", async () => {
  const out = await runLicitacoesMonitorConnector({ runId: "test-run", allowFixtureFallback: true });
  assert.equal(out.ok, true);
  assert.ok(out.signals.length >= 10);
});
