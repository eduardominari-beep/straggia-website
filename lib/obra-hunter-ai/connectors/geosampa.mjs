import { createLogger } from "../core/logger.mjs";

const logger = createLogger("connector:geosampa");

const GEOSAMPA_OWS_URL = process.env.GEOSAMPA_WFS_URL ?? "https://wms.geosampa.prefeitura.sp.gov.br/geoserver/ows";

export async function runGeosampaConnector({ cityKey = "sao-paulo", fetchImpl = fetch } = {}) {
  const startedAt = new Date().toISOString();

  try {
    const typeName = process.env.GEOSAMPA_TYPENAME ?? (await discoverGeoSampaTypeName(fetchImpl));
    if (!typeName) {
      throw new Error("geosampa_typename_not_found");
    }

    const requestUrl = buildGetFeatureUrl(typeName);
export async function runGeosampaConnector({ cityKey = "sao-paulo", fetchImpl = fetch } = {}) {
  const startedAt = new Date().toISOString();

  // Endpoint público WFS do GeoSampa (pode variar por camada; mantido configurável para evolução).
  const baseUrl = process.env.GEOSAMPA_WFS_URL ?? "https://wfs.geosampa.prefeitura.sp.gov.br/geoserver/ows";
  const typeName = process.env.GEOSAMPA_TYPENAME ?? "geosampa:acessos_livre";

  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    count: "50",
    typeNames: typeName,
  });

  const requestUrl = `${baseUrl}?${params}`;

  try {
    const response = await fetchImpl(requestUrl, {
      headers: {
        "user-agent": "ObraHunterAI/1.0 (+lead-radar)",
        accept: "application/json,application/geo+json,text/xml",
      },
    });

    if (!response.ok) throw new Error(`GeoSampa HTTP ${response.status}`);
    if (!response.ok) {
      throw new Error(`GeoSampa HTTP ${response.status}`);
    }

    const payload = await response.json();
    const signals = parseGeoSampaPayload(payload, cityKey, requestUrl);

    logger.info("GeoSampa connector completed", { cityKey, signals: signals.length, typeName });

    logger.info("GeoSampa connector completed", { cityKey, signals: signals.length });
    return {
      connector: "geosampa",
      cityKey,
      startedAt,
      finishedAt: new Date().toISOString(),
      ok: true,
      mode: "live",
      recordsCollected: signals.length,
      signals,
      requestUrl,
      typeName,
    };
  } catch (error) {
    logger.error("GeoSampa connector failed", { cityKey, error: String(error) });
      signals,
      requestUrl,
    };
  } catch (error) {
    logger.error("GeoSampa connector failed", { cityKey, error: String(error), requestUrl });

    return {
      connector: "geosampa",
      cityKey,
      startedAt,
      finishedAt: new Date().toISOString(),
      ok: false,
      mode: "live",
      signals: [],
      requestUrl: GEOSAMPA_OWS_URL,
      signals: [],
      requestUrl,
      error: String(error),
    };
  }
}

function buildGetFeatureUrl(typeName) {
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    outputFormat: "application/json",
    srsName: "EPSG:4326",
    count: "100",
    typeNames: typeName,
  });
  return `${GEOSAMPA_OWS_URL}?${params}`;
}

export async function discoverGeoSampaTypeName(fetchImpl = fetch) {
  const capabilitiesUrl = `${GEOSAMPA_OWS_URL}?service=WFS&version=1.1.0&request=GetCapabilities`;
  const response = await fetchImpl(capabilitiesUrl, { headers: { accept: "application/xml,text/xml" } });
  if (!response.ok) throw new Error(`GeoSampa Capabilities HTTP ${response.status}`);
  const xml = await response.text();

  const names = [...xml.matchAll(/<\s*(?:wfs:)?Name\s*>\s*([^<]+)\s*<\s*\/\s*(?:wfs:)?Name\s*>/gi)]
    .map((m) => m[1])
    .filter((n) => n.includes(":"));

  const preferred = pickBestTypeName(names);
  if (preferred) return preferred;

  return null;
}

export function pickBestTypeName(typeNames) {
  const keywords = ["alvara", "licenc", "licenciamento", "slc", "obra", "edificacao"];

  return (
    typeNames.find((n) => {
      const lower = n.toLowerCase();
      return keywords.some((k) => lower.includes(k));
    }) ?? null
  );
}

export function parseGeoSampaPayload(payload, cityKey, evidenceUrl) {
  if (!payload || !Array.isArray(payload.features)) return [];

  return payload.features.slice(0, 100).map((feature) => {
    const p = feature.properties ?? {};
    const area = Number(p.area ?? p.area_construida ?? p.metragem ?? 0);

    const signals = ["novo_alvara"];
    if (area >= 1500) signals.push("grande_metragem");

    const usageRaw = `${p.uso ?? p.categoria_uso ?? p.finalidade ?? ""}`.toLowerCase();
    if (usageRaw.includes("comercial")) signals.push("uso_comercial");
    if (usageRaw.includes("industrial")) signals.push("uso_industrial");

    return {
      source: "GeoSampa",
      sourceAgency: "Prefeitura de São Paulo",
      cityKey,
      probableCompany: p.requerente ?? p.proprietario ?? "não identificado",
      address: p.endereco ?? p.logradouro ?? p.distrito ?? "não identificado",
      lotLocation: p.sql ?? "não informado",
      probablePhase: "licenciamento",
      approachKeywords: ["alvará", "licenciamento", "obra privada"],
      cityKey,
      probableCompany: p.requerente ?? p.proprietario ?? "não identificado",
      address: p.endereco ?? p.logradouro ?? p.distrito ?? "não identificado",
      probableWorkType: p.tipo_obra ?? p.descricao ?? "obra licenciada",
      detectionReason: "Registro urbanístico/licenciamento identificado no GeoSampa.",
      documentId: String(p.numero_alvara ?? p.id ?? feature.id ?? ""),
      signals,
      evidenceUrl,
      capturedAt: new Date().toISOString(),
      observations: "Conferir responsável técnico e estágio do processo no SLC-e.",
    };
  });
}
