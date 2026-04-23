import { createLogger } from "../core/logger.mjs";

const logger = createLogger("connector:geosampa");

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

    if (!response.ok) {
      throw new Error(`GeoSampa HTTP ${response.status}`);
    }

    const payload = await response.json();
    const signals = parseGeoSampaPayload(payload, cityKey, requestUrl);

    logger.info("GeoSampa connector completed", { cityKey, signals: signals.length });
    return {
      connector: "geosampa",
      cityKey,
      startedAt,
      finishedAt: new Date().toISOString(),
      ok: true,
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
      signals: [],
      requestUrl,
      error: String(error),
    };
  }
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
      cityKey,
      probableCompany: p.requerente ?? p.proprietario ?? "não identificado",
      address: p.endereco ?? p.logradouro ?? p.distrito ?? "não identificado",
      probableWorkType: p.tipo_obra ?? p.descricao ?? "obra licenciada",
      detectionReason: "Registro urbanístico/licenciamento identificado no GeoSampa.",
      documentId: String(p.numero_alvara ?? p.id ?? feature.id ?? ""),
      signals,
      evidenceUrl,
      capturedAt: new Date().toISOString(),
    };
  });
}
