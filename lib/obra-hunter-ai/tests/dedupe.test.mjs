import test from "node:test";
import assert from "node:assert/strict";
import { dedupeLeads } from "../core/dedupe.mjs";

test("dedupeLeads mantém lead com maior score", () => {
  const leads = [
    { cityKey: "sao-paulo", documentId: "1", address: "Rua A", probableCompany: "X", score: 60 },
    { cityKey: "sao-paulo", documentId: "1", address: "Rua A", probableCompany: "X", score: 90 },
  ];
  const out = dedupeLeads(leads);
  assert.equal(out.length, 1);
  assert.equal(out[0].score, 90);
});
