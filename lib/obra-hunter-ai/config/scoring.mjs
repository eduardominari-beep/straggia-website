export const DEFAULT_WEIGHTS = {
  novoAlvara: 30,
  grandeMetragem: 20,
  usoComercial: 14,
  usoIndustrial: 16,
  expansaoEmpresarial: 12,
  compraTerreno: 10,
  vagaGerenteObra: 10,
  regiaoEstrategica: 12,
  empresaSolida: 10,
  multiplosSinais: 14,
};

export function scoreOpportunity(signals, cityConfig, weights = DEFAULT_WEIGHTS) {
  const signalSet = new Set(signals);
  let score = 0;

  if (signalSet.has("novo_alvara")) score += weights.novoAlvara;
  if (signalSet.has("grande_metragem")) score += weights.grandeMetragem;
  if (signalSet.has("uso_comercial")) score += weights.usoComercial;
  if (signalSet.has("uso_industrial")) score += weights.usoIndustrial;
  if (signalSet.has("expansao_empresarial")) score += weights.expansaoEmpresarial;
  if (signalSet.has("compra_terreno")) score += weights.compraTerreno;
  if (signalSet.has("vaga_gerente_obra")) score += weights.vagaGerenteObra;
  if (signalSet.has("empresa_solida")) score += weights.empresaSolida;

  if (cityConfig) {
    score += Math.round(weights.regiaoEstrategica * cityConfig.strategicWeight);
  }

  if (signalSet.size >= 3) score += weights.multiplosSinais;

  const capped = Math.max(0, Math.min(100, score));

  return {
    score: capped,
    urgency: capped >= 80 ? "alta" : capped >= 55 ? "media" : "baixa",
    estimatedTicket: capped >= 80 ? "R$ 1.5M+" : capped >= 55 ? "R$ 400k - R$ 1.5M" : "R$ 80k - R$ 400k",
  };
}
