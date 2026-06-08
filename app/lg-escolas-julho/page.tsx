import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, CalendarDays, ShieldCheck } from "lucide-react"

import { LgEscolasJulhoForm } from "./lg-escolas-julho-form"

export const metadata: Metadata = {
  title: "Reformas e manutenções escolares para julho | LG Serviços e Vidros",
  description:
    "Landing page para escolas particulares interessadas em reformas, manutenções e adequações durante o recesso de julho.",
}

const servicos = [
  "Pintura",
  "Vidros",
  "Serralheria",
  "Cobertura",
  "Fachada",
  "Manutenção",
  "Outras adequações",
]

export default function LgEscolasJulhoPage() {
  return (
    <main className="min-h-screen bg-[#f4f7f7] text-[#1d2a30]">
      <header className="border-b border-[#d7e1e3] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-3 sm:px-6">
          <Image
            src="/brand/lg-servicos-vidros-logo.png"
            alt="LG Serviços e Vidros. Obra limpa. Escola segura."
            width={1194}
            height={186}
            priority
            className="h-12 w-auto max-w-full object-contain sm:h-14 md:h-16"
          />
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#1d272d] text-white">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(47,140,145,0.16)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-10 lg:py-10">
          <div className="flex flex-col justify-center">
            <div className="mb-4 flex flex-wrap gap-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2">
                <CalendarDays className="size-4 text-[#62c0c2]" />
                Recesso escolar de julho
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-display font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Reformas e manutenções escolares para julho
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Aproveite o recesso escolar para resolver reformas, manutenções e adequações antes da volta às aulas.
            </p>

            <div className="mt-5 grid gap-3 text-sm text-white/75 sm:grid-cols-3 lg:max-w-2xl">
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#62c0c2]" />
                Execução responsável
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#62c0c2]" />
                Foco em prazo
              </div>
              <div className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#62c0c2]" />
                Segurança no ambiente
              </div>
            </div>
          </div>

          <div id="form" className="lg:py-1">
            <LgEscolasJulhoForm />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:py-10">
        <div>
          <h2 className="text-lg font-display font-semibold text-[#1d2a30]">
            Serviços
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {servicos.map((servico) => (
              <li
                key={servico}
                className="rounded-md border border-[#d7e1e3] bg-white px-3 py-2 text-sm font-medium text-[#59676d] shadow-sm"
              >
                {servico}
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-3xl text-sm leading-6 text-[#59676d] sm:text-base">
            A LG Serviços e Vidros atende demandas de reformas, manutenções e adequações em ambientes escolares, com foco em prazo, segurança e execução responsável durante períodos de menor circulação de alunos.
          </p>
        </div>

        <aside className="border-l-2 border-[#2f8c91] bg-white px-4 py-4 text-sm leading-6 text-[#59676d] shadow-sm">
          <strong className="block font-display text-base text-[#1d2a30]">
            Como funciona o contato
          </strong>
          <span className="mt-1 block">
            A solicitação será direcionada para a equipe da LG Serviços e Vidros avaliar a melhor forma de atendimento.
          </span>
          <a
            href="#form"
            className="mt-4 inline-flex items-center gap-2 font-semibold text-[#2f8c91] hover:text-[#246f73]"
          >
            Ir para o formulário
            <ArrowRight className="size-4" />
          </a>
        </aside>
      </section>

      <footer className="border-t border-[#d7e1e3] bg-white px-4 py-5 text-center text-sm text-[#59676d] sm:px-6">
        LG Serviços e Vidros
      </footer>
    </main>
  )
}
