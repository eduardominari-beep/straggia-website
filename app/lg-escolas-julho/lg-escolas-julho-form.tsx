"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { AlertCircle, CheckCircle2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormValues = {
  nome: string
  email: string
  telefone: string
  escola: string
  cidade: string
  descricao: string
}

type SubmitState = "idle" | "loading" | "success" | "error"

const initialValues: FormValues = {
  nome: "",
  email: "",
  telefone: "",
  escola: "",
  cidade: "",
  descricao: "",
}

const successMessage =
  "Recebemos sua solicitação. A equipe da LG Serviços e Vidros entrará em contato para entender a demanda da escola e avaliar a melhor forma de atendimento."

const errorMessage =
  "Não foi possível enviar sua solicitação agora. Tente novamente em instantes ou revise os dados preenchidos."

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasValidTelefone(telefone: string) {
  return telefone.replace(/\D/g, "").length >= 8
}

function formatTelefone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

function getTrackingValue(key: string) {
  if (typeof window === "undefined") return ""
  return new URLSearchParams(window.location.search).get(key) || ""
}

export function LgEscolasJulhoForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [submitState, setSubmitState] = useState<SubmitState>("idle")

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitState("loading")

    const lead = {
      nome: values.nome.trim(),
      email: values.email.trim(),
      telefone: values.telefone.trim(),
      escola: values.escola.trim(),
      cidade: values.cidade.trim(),
      descricao: values.descricao.trim(),
    }

    if (
      !lead.nome ||
      !lead.email ||
      !lead.telefone ||
      !lead.escola ||
      !lead.cidade ||
      !lead.descricao ||
      !isValidEmail(lead.email) ||
      !hasValidTelefone(lead.telefone)
    ) {
      setSubmitState("error")
      return
    }

    const payload = {
      nome_completo: lead.nome,
      email: lead.email,
      whatsapp: lead.telefone,
      telefone: lead.telefone,
      empresa: lead.escola,
      escola: lead.escola,
      cidade: lead.cidade,
      cidade_uf: lead.cidade,
      descricao: lead.descricao,
      objetivo: lead.descricao,
      objetivo_outro: "",
      faturamento_faixa: "",
      numero_alunos_faixa: "Não se aplica",
      origem: "Landing Page Straggia - LG Escolas Julho",
      status: "Novo",
      observacoes: "",
      aba_planilha: "Leads LG",
      segmento: "LG_ESCOLAS_JULHO",
      pagina: "/lg-escolas-julho",
      page_path: window.location.pathname,
      timestamp_iso: new Date().toISOString(),
      user_agent: navigator.userAgent,
      utm_source: getTrackingValue("utm_source"),
      utm_medium: getTrackingValue("utm_medium"),
      utm_campaign: getTrackingValue("utm_campaign"),
      utm_content: getTrackingValue("utm_content"),
      utm_term: getTrackingValue("utm_term"),
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || (data && data.ok === false)) {
        throw new Error("Lead request failed")
      }

      setValues(initialValues)
      setSubmitState("success")
    } catch {
      setSubmitState("error")
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-lg border border-[#d7e1e3] bg-white p-4 shadow-xl shadow-[#162329]/10 sm:p-5"
    >
      <p className="mb-4 text-sm leading-6 text-[#59676d]">
        Preencha os dados abaixo e entraremos em contato para entender a demanda da escola.
      </p>

      <div className="grid gap-3.5">
        <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
          Nome
          <Input
            required
            name="nome"
            value={values.nome}
            onChange={(event) => updateField("nome", event.target.value)}
            autoComplete="name"
            className="h-11 border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
          />
        </label>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
            E-mail
            <Input
              required
              type="email"
              name="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              className="h-11 border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
            Telefone / WhatsApp
            <Input
              required
              type="tel"
              name="telefone"
              value={values.telefone}
              onChange={(event) => updateField("telefone", formatTelefone(event.target.value))}
              autoComplete="tel"
              inputMode="tel"
              className="h-11 border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
            />
          </label>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
          <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
            Escola
            <Input
              required
              name="escola"
              value={values.escola}
              onChange={(event) => updateField("escola", event.target.value)}
              autoComplete="organization"
              className="h-11 border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
            Cidade
            <Input
              required
              name="cidade"
              value={values.cidade}
              onChange={(event) => updateField("cidade", event.target.value)}
              autoComplete="address-level2"
              className="h-11 border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
            />
          </label>
        </div>

        <label className="grid gap-1.5 text-sm font-medium text-[#1d2a30]">
          Descrição curta do que precisa
          <Textarea
            required
            name="descricao"
            value={values.descricao}
            onChange={(event) => updateField("descricao", event.target.value)}
            placeholder="Ex.: pintura, vidro, serralheria, cobertura, fachada, manutenção ou outra adequação."
            className="min-h-24 resize-y border-[#cfdadc] bg-[#fbfcfc] focus-visible:border-[#2f8c91] focus-visible:ring-[#2f8c91]/25"
          />
        </label>
      </div>

      <Button
        type="submit"
        disabled={submitState === "loading"}
        className="mt-4 h-11 w-full bg-[#2f8c91] text-white shadow-sm shadow-[#2f8c91]/20 hover:bg-[#246f73]"
      >
        {submitState === "loading" ? (
          "Enviando..."
        ) : (
          <>
            <Send className="size-4" />
            Solicitar contato
          </>
        )}
      </Button>

      {submitState === "success" && (
        <p className="mt-4 flex gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm leading-6 text-emerald-900">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>{successMessage}</span>
        </p>
      )}

      {submitState === "error" && (
        <p className="mt-4 flex gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm leading-6 text-red-900">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}
    </form>
  )
}
