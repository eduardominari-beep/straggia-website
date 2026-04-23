import { readFile } from "node:fs/promises";
import path from "node:path";
import { createLogger } from "../core/logger.mjs";
import { fetchWithRetry, persistRawCollection } from "../core/live-fetch.mjs";

const logger = createLogger("connector:licitacoes-monitor");

const SOURCES = [
  {
    key: "barueri",
    cityKey: "barueri",
    url: "https://alertalicitacao.com.br/!municipios/3505708",
    fixture: path.resolve("lib/obra-hunter-ai/data/fixtures/licitacoes-barueri.fixture.json"),
  },
  {
    key: "osasco",
    cityKey: "osasco",
    url: "https://alertalicitacao.com.br/!municipios/3534401",
    fixture: path.resolve("lib/obra-hunter-ai/data/fixtures/licitacoes-osasco.fixture.json"),
  },
];

export async function runLicitacoesMonitorConnector({ runId, allowFixtureFallback = false } = {}) {
  const startedAt = new Date().toISOString();
  const signals = [];
  const sourcesTried = [];

  for (const src of SOURCES) {
    try {
      const res = await fetchWithRetry(src.url, { attempts: 2, timeoutMs: 12000, headers: { "user-agent": "ObraHunterAI/1.0" } });
      const html = await res.text();
      const rawPath = await persistRawCollection({ runId, connector: `licitacoes-${src.key}`, extension: "html", body: html });
      sourcesTried.push({ url: src.url, mode: "live", rawPath, ok: true });

      const extracted = extractSimpleFromHtml(html, src.cityKey, src.url);
      if (extracted.length) signals.push(...extracted);
      continue;
    } catch (err) {
      sourcesTried.push({ url: src.url, mode: "live", ok: false, error: String(err) });
      if (!allowFixtureFallback) continue;
      const fixture = JSON.parse(await readFile(src.fixture, "utf-8"));
      logger.warn("Licitacoes fixture fallback enabled", { cityKey: src.cityKey, fixture: src.fixture });
      signals.push(...fixture.records.map((r) => toSignal(r, fixture.sourceUrl, fixture.capturedAt, "fixture_fallback")));
    }
  }

  return {
    connector: "licitacoes-monitor",
    cityKey: "multi",
    startedAt,
    finishedAt: new Date().toISOString(),
    ok: signals.length > 0,
    mode: signals.length > 0 ? "mixed" : "live-only",
    recordsCollected: signals.length,
    signals,
    requestUrl: SOURCES.map((s) => s.url).join(","),
    sourcesTried,
  };
}

function extractSimpleFromHtml(html, cityKey, evidenceUrl) {
  const matches = [...html.matchAll(/PREGÃO[^<]{10,220}/gi)].slice(0, 6);
  return matches.map((m, idx) => toSignal({ id: `${cityKey}-live-${idx + 1}`, titulo: m[0], orgao: `Prefeitura de ${cityKey}` , cidade: cityKey }, evidenceUrl, new Date().toISOString(), "licitacao_publicada"));
}

function toSignal(row, evidenceUrl, capturedAt, probablePhase) {
  const txt = row.titulo.toUpperCase();
  const signals = ["expansao_empresarial", "novo_alvara"];
  if (txt.includes("REFORMA") || txt.includes("MANUTENCAO")) signals.push("uso_comercial");
  if (txt.includes("INFRAESTRUTURA") || txt.includes("ELETRIC")) signals.push("uso_industrial");
  return {
    source: "Monitor de Licitações",
    sourceAgency: row.orgao,
    cityKey: row.cidade,
    probableCompany: "Fornecedor/empreiteira a contratar",
    address: `${row.cidade}/SP (a confirmar no edital)`,
    lotLocation: "A confirmar",
    probableWorkType: row.titulo,
    probablePhase,
    approachKeywords: ["licitação", "obra pública", "prospecção edital"],
    detectionReason: "Publicação de contratação/serviço de engenharia com potencial de obra.",
    documentId: row.id,
    signals,
    evidenceUrl,
    capturedAt,
    observations: "Ler edital para escopo técnico, exigências e cronograma de visita.",
  };
}
