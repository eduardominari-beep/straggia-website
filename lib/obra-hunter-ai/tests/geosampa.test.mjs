import test from "node:test";
import assert from "node:assert/strict";
import { parseGeoSampaPayload, pickBestTypeName } from "../connectors/geosampa.mjs";
import { parseGeoSampaPayload } from "../connectors/geosampa.mjs";

test("parseGeoSampaPayload converte features em sinais", () => {
  const payload = {
    features: [{
      id: "abc",
      properties: {
        area: 1800,
        uso: "Comercial",
        endereco: "Av. Paulista, 1000",
        tipo_obra: "Nova edificação",
        requerente: "Empresa Teste",
      },
    }],
  };

  const signals = parseGeoSampaPayload(payload, "sao-paulo", "https://evidence");
  assert.equal(signals.length, 1);
  assert.deepEqual(signals[0].signals.includes("grande_metragem"), true);
  assert.deepEqual(signals[0].signals.includes("uso_comercial"), true);
});

test("pickBestTypeName prioriza camadas relacionadas a alvará/licenciamento", () => {
  const selected = pickBestTypeName([
    "geosampa:acessos_livre",
    "geoportal:alvara_aprovacao",
    "geoportal:hidrografia",
  ]);

  assert.equal(selected, "geoportal:alvara_aprovacao");
});
