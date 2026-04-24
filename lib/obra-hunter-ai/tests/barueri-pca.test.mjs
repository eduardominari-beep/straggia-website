import test from "node:test";
import assert from "node:assert/strict";
import { extractPcaPdfUrl, runBarueriPcaConnector } from "../connectors/barueri-pca.mjs";

test("barueri connector usa fixture apenas com fallback explícito", async () => {
  const out = await runBarueriPcaConnector({ runId: "test-run", allowFixtureFallback: true });
  assert.equal(out.ok, true);
  assert.equal(out.mode, "fixture-fallback");
  assert.ok(out.signals.length >= 1);
});

test("extractPcaPdfUrl encontra link do PDF no portal", () => {
  const html = '<a href="/Transparencia/downloads/Planejamento/PCA_2026_-_Cronograma_de_Contrata%C3%A7%C3%B5es_OBRAS.pdf?ent=1&amp;np=1">PCA</a>';
  const url = extractPcaPdfUrl(html);
  assert.equal(
    url,
    "https://www.barueri.sp.gov.br/Transparencia/downloads/Planejamento/PCA_2026_-_Cronograma_de_Contrata%C3%A7%C3%B5es_OBRAS.pdf?ent=1&np=1",
  );
});
