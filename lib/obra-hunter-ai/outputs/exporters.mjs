import { writeFile } from "node:fs/promises";
import path from "node:path";

function toCsv(leads) {
  const header = ["city", "sourceAgency", "probableCompany", "address", "lotLocation", "probablePhase", "probableWorkType", "score", "urgency", "confidence", "estimatedTicket", "detectionReason", "nextCommercialAction", "approachKeywords", "observations", "source", "evidenceUrl"];
  const rows = leads.map((lead) => header.map((key) => JSON.stringify(lead[key] ?? "")).join(","));
  return [header.join(","), ...rows].join("\n");
}

export async function writeOutputs({ runDir, leads, runMeta }) {
  const jsonPath = path.join(runDir, "ranking-semanal.json");
  const csvPath = path.join(runDir, "ranking-semanal.csv");
  const mdPath = path.join(runDir, "ranking-semanal.md");
  const dashboardPath = path.join(runDir, "dashboard.html");

  const sorted = [...leads].sort((a, b) => b.score - a.score);

  await writeFile(jsonPath, JSON.stringify({ runMeta, leads: sorted }, null, 2), "utf-8");
  await writeFile(csvPath, toCsv(sorted), "utf-8");
  await writeFile(mdPath, toMarkdown(sorted, runMeta), "utf-8");
  await writeFile(dashboardPath, toDashboard(sorted, runMeta), "utf-8");

  return { jsonPath, csvPath, mdPath, dashboardPath };
}

function toMarkdown(leads, runMeta) {
  const lines = [
    "# TOP OPORTUNIDADES DA SEMANA",
    "",
    `- Executado em: ${runMeta.executedAt}`,
    `- Cidades alvo: ${runMeta.cities.join(", ")}`,
    `- Total de leads: ${leads.length}`,
    "",
  ];

  if (!leads.length) {
    lines.push("Nenhum lead elegível encontrado nesta execução.");
    return lines.join("\n");
  }

  leads.forEach((lead, index) => {
    lines.push(`## ${index + 1}. ${lead.city} | Score ${lead.score}`);
    lines.push(`- Órgão/Fonte: ${lead.sourceAgency}`);
    lines.push(`- Empresa provável: ${lead.probableCompany}`);
    lines.push(`- Endereço: ${lead.address}`);
    lines.push(`- Lote/localização: ${lead.lotLocation}`);
    lines.push(`- Fase provável: ${lead.probablePhase}`);
    lines.push(`- Tipo provável de obra: ${lead.probableWorkType}`);
    lines.push(`- Motivo da detecção: ${lead.detectionReason}`);
    lines.push(`- Grau de confiança: ${lead.confidence}`);
    lines.push(`- Ticket estimado: ${lead.estimatedTicket}`);
    lines.push(`- Urgência: ${lead.urgency}`);
    lines.push(`- Próxima ação comercial: ${lead.nextCommercialAction}`);
    lines.push(`- Palavras-chave de abordagem: ${(lead.approachKeywords || []).join(", ") || "-"}`);
    lines.push(`- Observações: ${lead.observations || "-"}`);
    lines.push(`- Fonte: ${lead.source}`);
    lines.push(`- Evidência: ${lead.evidenceUrl}`);
    lines.push("");
  });

  return lines.join("\n");
}

function toDashboard(leads, runMeta) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>Obra Hunter AI Dashboard</title></head>
<body>
  <h1>Obra Hunter AI — Ranking semanal</h1>
  <p>Executado em: ${runMeta.executedAt}</p>
  <p>Total de leads: ${leads.length}</p>
  <ol>
    ${leads.map((l) => `<li><strong>${l.city}</strong> - ${l.probableWorkType} - Score ${l.score}</li>`).join("\n")}
  </ol>
</body>
</html>`;
}
