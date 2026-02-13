import { NextResponse } from "next/server";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const GAS_URL = (process.env.LEADS_GAS_URL || "").trim();
  const API_KEY = (process.env.LEADS_API_KEY || "").trim();

  return json({
    ok: true,
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",
    vercel_url: process.env.VERCEL_URL || null,
    has_gas_url: !!GAS_URL,
    has_api_key: !!API_KEY,
    gas_url_len: GAS_URL.length,
    api_key_len: API_KEY.length,
  });
}

export async function POST(req: Request) {
  try {
    const GAS_URL = (process.env.LEADS_GAS_URL || "").trim();
    const API_KEY = (process.env.LEADS_API_KEY || "").trim();

    if (!GAS_URL || !API_KEY) {
      return json({ ok: false, error: "Server misconfigured (missing env vars)." }, 500);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ ok: false, error: "Invalid JSON." }, 400);
    }

    const nome = String(body.nome_completo || "").trim();
    const empresa = String(body.empresa || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const faturamento = String(body.faturamento_faixa || "").trim();
    const numeroAlunos = String(body.numero_alunos_faixa || "").trim();
    const objetivo = String(body.objetivo || "").trim();

    // ✅ regra: precisa ter nome/empresa/whatsapp/objetivo e (faturamento OU numero alunos)
    if (!nome || !empresa || !whatsapp || !objetivo || (!faturamento && !numeroAlunos)) {
      return json({ ok: false, error: "Missing required fields." }, 400);
    }

    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "";

    // ✅ payload padronizado (api_key só no server)
    const payload = {
      ...body,
      api_key: API_KEY,
      user_agent: body.user_agent || req.headers.get("user-agent") || "",
      ip,
      timestamp_iso: body.timestamp_iso || new Date().toISOString(),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json,text/plain,*/*" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "follow",
    }).finally(() => clearTimeout(timeout));

    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch {}

    if (!res.ok || (data && data.ok === false)) {
      const baseMsg = (data && data.error) ? data.error : `GAS failed (${res.status}).`;
      const debug =
        process.env.NODE_ENV === "development"
          ? ` Body: ${text.slice(0, 280)}`
          : "";
      return json({ ok: false, error: baseMsg + debug }, 502);
    }

    return json({ ok: true, message: (data && data.message) ? data.message : "Received." }, 200);
  } catch {
    return json({ ok: false, error: "Unexpected server error." }, 500);
  }
}