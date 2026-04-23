export function buildDedupKey(lead) {
  const address = (lead.address ?? "").trim().toLowerCase();
  const company = (lead.probableCompany ?? "").trim().toLowerCase();
  const doc = (lead.documentId ?? "").trim().toLowerCase();
  return [lead.cityKey, doc, address, company].join("|");
}

export function dedupeLeads(leads) {
  const seen = new Map();
  for (const lead of leads) {
    const key = buildDedupKey(lead);
    const existing = seen.get(key);
    if (!existing || (lead.score ?? 0) > (existing.score ?? 0)) {
      seen.set(key, lead);
    }
  }
  return [...seen.values()];
}
