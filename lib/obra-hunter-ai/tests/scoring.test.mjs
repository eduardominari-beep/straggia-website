import test from "node:test";
import assert from "node:assert/strict";
import { scoreOpportunity } from "../config/scoring.mjs";

test("scoreOpportunity calcula score/urgencia", () => {
  const out = scoreOpportunity(["novo_alvara", "grande_metragem", "uso_comercial"], { strategicWeight: 1 });
  assert.equal(out.urgency, "alta");
  assert.ok(out.score >= 80);
});
