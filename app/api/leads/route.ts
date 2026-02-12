import { NextResponse } from "next/server"

type AnyObj = Record<string, any>

function json(data: AnyObj, status = 200) {
  return NextResponse.json(data, { status })
}

// Se você quiser rodar em Edge, dá pra trocar, mas Node é mais previsível pra fetch/timeouts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Opcional: responder preflight se algum browser insistir (não deveria, por ser same-origin)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

function toStr(v: any) {
  return v === null || v === undefined ? "" : String(v).trim()
}

function normalizeWhatsapp(v: any) {
  // mantém só dígitos; remove 55 se vier com DDI; retorna DDD+numero
  const digits = toStr(v).replace(/\D+/g, "")
  if (!digits) return ""
  return digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits
}

function normalizeFaturamento(v: any) {
  // evita rejeição por "-" vs "–"
  const s = toStr(v)
  return s ? s.replace(/-/g, "–") : ""
}

export async function POST(req: Request) {
  try {
    const GAS_URL = process.env.LEADS_GAS_URL
    const API_KEY = process.env.LEADS_API_KEY

    if (!GAS_URL || !API_KEY) {
      return json({ ok: false, error: "Server misconfigured (missing env vars)." }, 500)
    }

    const body = (await req.json().catch(() => null)) as AnyObj | null
    if (!body || typeof body !== "object") {
      return json({ ok: false, error: "JSON inválido." }, 400)
    }

    /**
     * Compat: se algum front ainda manda campos antigos,
     * a gente mapeia para o contrato do Apps Script.
     */
    const nomeCompleto = toStr(body.nome_completo || body.nome)
    const empresa = toStr(body.empresa)
    const whatsapp = normalizeWhatsapp(body.whatsapp)
    const faturamentoFaixa = normalizeFaturamento(body.faturamento_faixa || body.faturamentoAnual)
    const objetivo = toStr(body.objetivo)
    const objetivoOutro = toStr(body.objetivo_outro || body.objetivoOutro)
    const cidadeUf = toStr(body.cidade_uf || body.cidadeUf)

    // validação mínima (sem fricção, mas sem lixo)
    if (!nomeCompleto || nomeCompleto.length < 5 || nomeCompleto.split(/\s+/).length < 2) {
      return json({ ok: false, error: "Informe nome e sobrenome." }, 400)
    }
    if (!empresa || empresa.length < 2) {
      return json({ ok: false, error: "Informe o nome da empresa." }, 400)
    }
    if (!whatsapp || whatsapp.length < 10) {
      return json({ ok: false, error: "WhatsApp inválido." }, 400)
    }
    if (!faturamentoFaixa) {
      return json({ ok: false, error: "Selecione a faixa de faturamento." }, 400)
    }
    if (!objetivo) {
      return json({ ok: false, error: "Selecione o objetivo." }, 400)
    }
    // (Opcional) se quiser bloquear "Outro" sem descrição no backend:
    // if (objetivo === "Outro" && !objetivoOutro) {
    //   return json({ ok: false, error: "Descreva seu objetivo." }, 400)
    // }

    // IP (best effort) — em Vercel vem no x-forwarded-for
    const forwardedFor = req.headers.get("x-forwarded-for") || ""
    const ip = forwardedFor.split(",")[0]?.trim() || ""

    // monta payload FINAL pro Apps Script
    const payload: AnyObj = {
      ...body,

      // força os nomes canônicos que o GAS espera:
      api_key: API_KEY,
      nome_completo: nomeCompleto,
      whatsapp,
      empresa,
      faturamento_faixa: faturamentoFaixa,
      objetivo,
      objetivo_outro: objetivoOutro,
      cidade_uf: cidadeUf,

      // tracking (mantém se vier; senão, vazio)
      utm_source: toStr(body.utm_source),
      utm_medium: toStr(body.utm_medium),
      utm_campaign: toStr(body.utm_campaign),
      utm_content: toStr(body.utm_content),
      utm_term: toStr(body.utm_term),
      page_path: toStr(body.page_path),
      segmento: toStr(body.segmento),
      pagina: toStr(body.pagina),

      user_agent: toStr(body.user_agent) || req.headers.get("user-agent") || "",
      ip,
      timestamp_iso: toStr(body.timestamp_iso) || new Date().toISOString(),
    }

    const doFetch = async () => {
      const controller = new AbortController()
      const t = setTimeout(() => controller.abort(), 6500)

      try {
        return await fetch(GAS_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(t)
      }
    }

    // 1 tentativa + 1 retry rápido
    let res: Response
    try {
      res = await doFetch()
    } catch {
      res = await doFetch()
    }

    const text = await res.text()
    let data: AnyObj | null = null
    try {
      data = JSON.parse(text)
    } catch {
      // ok — Apps Script pode responder texto puro
    }

    if (!res.ok || (data && data.ok === false)) {
      const msg = data?.error ? data.error : `Falha no backend (${res.status}).`
      return json({ ok: false, error: msg }, 502)
    }

    return json(
      { ok: true, message: data?.message ? data.message : "Recebido." },
      200
    )
  } catch {
    return json({ ok: false, error: "Erro inesperado no servidor." }, 500)
  }
}