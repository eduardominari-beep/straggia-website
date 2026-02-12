import { NextResponse } from "next/server"

function json(data: any, status = 200) {
  return NextResponse.json(data, { status })
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// ✅ DEBUG: permite checar no ar se o server enxerga as env vars (sem vazar valor)
export async function GET() {
  const hasGasUrl = !!process.env.LEADS_GAS_URL
  const hasApiKey = !!process.env.LEADS_API_KEY
  return json(
    {
      ok: true,
      env: {
        LEADS_GAS_URL: hasGasUrl,
        LEADS_API_KEY: hasApiKey,
      },
    },
    200
  )
}

export async function POST(req: Request) {
  try {
    const GAS_URL = process.env.LEADS_GAS_URL
    const API_KEY = process.env.LEADS_API_KEY

    if (!GAS_URL || !API_KEY) {
      return json(
        {
          ok: false,
          error: "Server misconfigured (missing env vars).",
          missing: {
            LEADS_GAS_URL: !GAS_URL,
            LEADS_API_KEY: !API_KEY,
          },
        },
        500
      )
    }

    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return json({ ok: false, error: "JSON inválido." }, 400)
    }

    const nome = String(body.nome_completo || "").trim()
    const empresa = String(body.empresa || "").trim()
    const whatsapp = String(body.whatsapp || "").trim()
    const faturamento = String(body.faturamento_faixa || "").trim()
    const objetivo = String(body.objetivo || "").trim()

    if (!nome || !empresa || !whatsapp || !faturamento || !objetivo) {
      return json({ ok: false, error: "Campos obrigatórios ausentes." }, 400)
    }

    const forwardedFor = req.headers.get("x-forwarded-for") || ""
    const ip = forwardedFor.split(",")[0]?.trim() || ""

    const payload = {
      ...body,
      api_key: API_KEY,
      user_agent: body.user_agent || req.headers.get("user-agent") || "",
      ip,
      timestamp_iso: body.timestamp_iso || new Date().toISOString(),
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6500)

    let res: Response
    try {
      res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
    } catch {
      clearTimeout(timeout)
      const controller2 = new AbortController()
      const timeout2 = setTimeout(() => controller2.abort(), 6500)

      res = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller2.signal,
      }).finally(() => clearTimeout(timeout2))
    } finally {
      clearTimeout(timeout)
    }

    const text = await res.text()
    let data: any = null
    try {
      data = JSON.parse(text)
    } catch {}

    if (!res.ok || (data && data.ok === false)) {
      const msg = data?.error ? data.error : `Falha no backend (${res.status}).`
      return json({ ok: false, error: msg }, 502)
    }

    return json({ ok: true, message: data?.message ?? "Recebido." }, 200)
  } catch {
    return json({ ok: false, error: "Erro inesperado no servidor." }, 500)
  }
}