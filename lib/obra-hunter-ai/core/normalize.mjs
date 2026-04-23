import { getCityConfig } from "../config/cities.mjs";
import { scoreOpportunity } from "../config/scoring.mjs";

export function normalizeSignal(signal) {
  const cityConfig = getCityConfig(signal.cityKey);
  const scoring = scoreOpportunity(signal.signals, cityConfig);

  return {
    source: signal.source,
    sourceAgency: signal.sourceAgency ?? "não informado",
    cityKey: signal.cityKey,
    city: cityConfig?.name ?? signal.cityKey,
    probableCompany: signal.probableCompany ?? "não identificado",
    address: signal.address ?? "não identificado",
    probableWorkType: signal.probableWorkType ?? "obra civil",
    lotLocation: signal.lotLocation ?? "não informado",
    probablePhase: signal.probablePhase ?? "intenção",
    approachKeywords: signal.approachKeywords ?? [],
    detectionReason: signal.detectionReason,
    documentId: signal.documentId ?? "",
    signals: signal.signals,
    evidenceUrl: signal.evidenceUrl,
    capturedAt: signal.capturedAt ?? new Date().toISOString(),
    score: scoring.score,
    urgency: scoring.urgency,
    confidence: confidenceFromSignals(signal.signals),
    estimatedTicket: scoring.estimatedTicket,
    nextCommercialAction: suggestNextAction(scoring.score),
    observations: signal.observations ?? "",
  };
}

function suggestNextAction(score) {
  if (score >= 80) return "Contato comercial em até 24h com proposta técnica preliminar.";
  if (score >= 55) return "Qualificar decisor e agendar visita em até 5 dias úteis.";
  return "Nutrir lead e monitorar novos sinais por 2 semanas.";
}

function confidenceFromSignals(signals = []) {
  const size = new Set(signals).size;
  if (size >= 4) return "alta";
  if (size >= 2) return "média";
  return "baixa";
}
