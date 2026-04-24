import { readFile } from "node:fs/promises";
import path from "node:path";
import { createLogger } from "../core/logger.mjs";
import { fetchWithRetry, persistRawCollection } from "../core/live-fetch.mjs";

const logger = createLogger("connector:barueri-pca");

const PCA_PORTAL_URL = "https://www.barueri.sp.gov.br/transparencia/PlanejamentoPCA.aspx?ent=&np=1";
const FIXTURE_PATH = path.resolve("lib/obra-hunter-ai/data/fixtures/barueri-pca.fixture.json");

export async function runBarueriPcaConnector({ runId, allowFixtureFallback = false } = {}) {
  const startedAt = new Date().toISOString();

  try {
    const portalResponse = await fetchWithRetry(PCA_PORTAL_URL, {
      attempts: 3,
      timeoutMs: 20000,
      headers: { "user-agent": "ObraHunterAI/1.0" },
    });

    const portalHtml = await portalResponse.text();
    await persistRawCollection({ runId, connector: "barueri-pca-portal", extension: "html", body: portalHtml });

    const pdfUrl = extractPcaPdfUrl(portalHtml);
    if (!pdfUrl) throw new Error("barueri_pca_pdf_url_not_found");

    const pdfResponse = await fetchWithRetry(pdfUrl, {
      attempts: 3,
      timeoutMs: 20000,
      headers: { "user-agent": "ObraHunterAI/1.0" },
    });

    const buffer = Buffer.from(await pdfResponse.arrayBuffer());
    const rawFile = await persistRawCollection({ runId, connector: "barueri-pca", extension: "pdf", body: buffer });

    throw new Error(`live_pdf_parser_not_available raw_file=${rawFile}`);
  } catch (liveError) {
    logger.warn("Barueri live collection failed", { error: String(liveError), sourceUrl: PCA_PORTAL_URL });

    if (!allowFixtureFallback) {
      return {
        connector: "barueri-pca",
        cityKey: "barueri",
        startedAt,
        finishedAt: new Date().toISOString(),
        ok: false,
        mode: "live-only",
        recordsCollected: 0,
        signals: [],
        requestUrl: PCA_PORTAL_URL,
        error: String(liveError),
      };
    }

    const raw = JSON.parse(await readFile(FIXTURE_PATH, "utf-8"));
    const signals = raw.records.map((row) => toSignal(row, raw.sourceUrl, raw.capturedAt, "fixture_fallback"));
    logger.warn("Barueri fixture fallback enabled explicitly", { fixture: FIXTURE_PATH, records: raw.records.length });

    return {
      connector: "barueri-pca",
      cityKey: "barueri",
      startedAt,
      finishedAt: new Date().toISOString(),
      ok: true,
      mode: "fixture-fallback",
      recordsCollected: raw.records.length,
      signals,
      requestUrl: raw.sourceUrl,
      evidence: { fixturePath: FIXTURE_PATH, capturedAt: raw.capturedAt },
      liveError: String(liveError),
    };
  }
}

export function extractPcaPdfUrl(html) {
  const patterns = [
    /href\s*=\s*"([^"]*PCA_2026[^"\s]*OBRAS\.pdf[^"\s]*)"/i,
    /href\s*=\s*"([^"]*Cronograma[^"\s]*Obras[^"\s]*\.pdf[^"\s]*)"/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match) continue;
    const url = match[1].replace(/&amp;/g, "&");
    if (url.startsWith("http")) return url;
    return new URL(url, PCA_PORTAL_URL).toString();
  }

  return null;
}

function toSignal(row, evidenceUrl, capturedAt, phase = "planejamento") {
  const descricao = (row.descricao || "").toUpperCase();
  const signals = ["novo_alvara", "expansao_empresarial"];

  if (row.valor >= 5_000_000) signals.push("grande_metragem");
  if (descricao.includes("INSTALACAO") || descricao.includes("ENGENHARIA")) signals.push("uso_industrial");
  if (descricao.includes("BOULEVARD") || descricao.includes("PRACA") || descricao.includes("DIVERSOS BAIRROS")) signals.push("uso_comercial");

  const keywords = buildKeywords(descricao);

  return {
    source: "Barueri PCA 2026",
    sourceAgency: row.requisitante ?? "Prefeitura de Barueri",
    cityKey: "barueri",
    probableCompany: "Contratação pública em aberto (empresa a definir)",
    address: "Barueri/SP (diversos bairros ou próprios municipais)",
    lotLocation: descricao.includes("LOTE") ? descricao.match(/LOTE\s*\d+/)?.[0] ?? "Lote não identificado" : "Diversos locais",
    probableWorkType: row.descricao,
    probablePhase: phase,
    approachKeywords: keywords,
    detectionReason: `Planejamento de contratação pública com potencial de obra/instalação. Valor estimado R$ ${Number(row.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
    documentId: row.id,
    signals,
    evidenceUrl,
    capturedAt,
    observations: `Unidade requisitante: ${row.requisitante}.`,
  };
}

function buildKeywords(text) {
  const tags = [];
  if (text.includes("RECAPEAMENTO") || text.includes("ASFALT")) tags.push("pavimentação", "asfalto");
  if (text.includes("TELHAD") || text.includes("PINTURA")) tags.push("cobertura", "pintura");
  if (text.includes("INSTALACAO") || text.includes("ELETRIC")) tags.push("instalações", "elétrica");
  if (text.includes("MANUTENCAO")) tags.push("manutenção");
  return tags.length ? tags : ["obra civil"];
}
