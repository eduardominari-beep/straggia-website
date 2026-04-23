export function applyEligibility(leads, { minScore = 35 } = {}) {
  const stats = {
    totalNormalized: leads.length,
    minScore,
    discardedByScore: 0,
    eligible: 0,
  };

  const eligible = [];
  const discarded = [];

  for (const lead of leads) {
    if ((lead.score ?? 0) < minScore) {
      stats.discardedByScore += 1;
      discarded.push({ lead, reason: `score_below_${minScore}` });
      continue;
    }
    eligible.push(lead);
  }

  stats.eligible = eligible.length;
  return { eligible, discarded, stats };
}
