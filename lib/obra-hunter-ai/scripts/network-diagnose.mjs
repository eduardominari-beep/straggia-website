#!/usr/bin/env node
import dns from "node:dns/promises";

async function checkFetch(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    return { url, ok: true, status: res.status, ms: Date.now() - started };
  } catch (error) {
    return { url, ok: false, error: String(error), ms: Date.now() - started };
  }
}

async function main() {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || null;
  const out = {
    ts: new Date().toISOString(),
    env: {
      HTTPS_PROXY: proxy,
      HTTP_PROXY: process.env.HTTP_PROXY || process.env.http_proxy || null,
      NO_PROXY: process.env.NO_PROXY || process.env.no_proxy || null,
    },
    checks: {},
  };

  if (proxy) {
    try {
      const host = proxy.replace(/^https?:\/\//, "").split(":")[0];
      out.checks.proxyDns = await dns.lookup(host);
    } catch (error) {
      out.checks.proxyDnsError = String(error);
    }
  }

  out.checks.targets = await Promise.all([
    checkFetch("https://www.barueri.sp.gov.br"),
    checkFetch("https://wfs.geosampa.prefeitura.sp.gov.br/geoserver/ows?service=WFS&request=GetCapabilities"),
    checkFetch("https://alertalicitacao.com.br/!municipios/3505708"),
  ]);

  console.log(JSON.stringify(out, null, 2));
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
