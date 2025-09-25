// app/quem-somos/page.tsx
import Image from "next/image" // ⬅️ ADICIONADO
import { getSEOMetadata } from "@/lib/seo"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Ícones (lucide) — padrão do site
import {
  BarChartBig, // Honestidade (fatos/métricas)
  Handshake,   // Parceria de valor
  Repeat2,     // Transferência de capacidades
  Focus,       // Foco
  ShieldCheck, // Integridade
  Heart,       // Humanidade
  Ruler,       // Precisão
  Minimize2,   // Simplicidade
} from "lucide-react"

export const metadata = getSEOMetadata({
  title: "Quem somos - Straggia",
  description:
    "Construímos parcerias sólidas e resultados reais que permanecem. Propósito, pilares e valores da Straggia Consultoria.",
})

export default function QuemSomosPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navbar (cliente) */}
      <Navbar />

      {/* Cabeçalho */}
      <header className="pt-28 md:pt-32 pb-8 border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-center">
            <span className="text-foreground">Quem </span>
            <span className="text-primary">somos</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed text-center">
            Construímos parcerias sólidas e resultados reais que permanecem. Alinhamos propósito e
            criação de valor por meio de estratégia priorizada, gestão clara e execução consistente.
            Transformamos ambição em resultado recorrente e mensurável.
          </p>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Propósito */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">Propósito</h2>
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <p className="text-lg md:text-xl leading-relaxed text-foreground">
              Construir parcerias sólidas e resultados reais que permanecem. Alinhamos propósito e
              criação de valor por meio de estratégia priorizada, gestão clara e execução
              consistente. Transformamos ambição em resultado recorrente e mensurável.
            </p>
          </div>
        </section>

        {/* Pilares */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Pilares</h2>
          <div className="space-y-4">
            <PillarCard
              Icon={BarChartBig}
              title="Honestidade intelectual"
              text="Fatos antes de opiniões. Hipóteses claras, métricas objetivas e decisão ancorada em evidências."
            />
            <PillarCard
              Icon={Handshake}
              title="Parceria de valor (ganha-ganha)"
              text="Interesses alinhados, transparência e corresponsabilidade pelo impacto. Medimos sucesso pelos resultados do cliente, sempre com escopo e entregáveis claros."
            />
            <PillarCard
              Icon={Repeat2}
              title="Transferência de capacidades"
              text="Fazemos junto. Pareamos times, consolidamos o que funciona e deixamos playbooks e ritos para o cliente operar e evoluir com autonomia."
            />
          </div>
        </section>

        {/* Valores */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValueCard Icon={Focus} title="Foco" text="Priorizar é escolher. Atuamos no que destrava valor agora." />
            <ValueCard
              Icon={ShieldCheck}
              title="Integridade"
              text="Ética, confidencialidade e compromisso com o que é certo."
            />
            <ValueCard
              Icon={Heart}
              title="Humanidade"
              text="Clareza com empatia, feedback direto, cuidado com as pessoas."
            />
            <ValueCard
              Icon={Ruler}
              title="Precisão"
              text="Rigor em método, dados e entregáveis. Qualidade auditável."
            />
            <ValueCard
              Icon={Minimize2}
              title="Simplicidade"
              text="Sem complexidades desnecessárias: o que é simples se entende; o que se entende, executa; o que se executa, escala."
            />
          </div>
        </section>

        {/* Time */}
        <section>
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-6">Time Straggia</h2>

        <TeamCard
            imageSrc="/team/eduardo.png"
            name="Eduardo Minari"
            role="Fundador | Head de Negócios | Líder da Consultoria"
            intro={[
              "Executivo com mais de 15 anos em gestão estratégica e operacional, Eduardo Minari é responsável por liderar a frente de negócios da Straggia Consultoria e coordenar os projetos, unindo visão estratégica à execução prática para transformar planos em resultados reais.",
              "Antes de fundar a Straggia, Eduardo liderou operações, finanças e gestão de pessoas em um grupo de escolas de educação básica super premium, promovendo performance, governança e desenvolvimento de equipes. Atuou no primeiro ciclo de planejamento estratégico de uma das maiores redes de educação privada do país e participou da Diretoria de Planejamento e Gestão em processos de M&A, contribuindo para valuation e preparação estratégica na aquisição de uma das maiores redes de franquia educacional do mundo.",
              "Por cinco anos, integrou a FALCONI Consultores de Resultado, conduzindo projetos de produtividade, eficiência e crescimento em empresas de indústria, varejo, serviços e instituições públicas, sempre com foco em gerar impacto positivo em processos, equipes e resultados organizacionais.",
            ]}
            highlights={[
              "Fundação da Straggia e recentemente, autoria de artigos profissionais em gestão.",
              "Liderança operacional, financeira e de pessoas em educação básica super premium.",
              "Planejamento estratégico corporativo em grande grupo de educação privada.",
              "M&A: valuation e apoio à aquisição de grande rede franqueada com atuação global.",
              "Experiência na FALCONI com projetos multissetoriais.",
            ]}
            focus="Estratégia clara, modelo de gestão ativo e execução acompanhada por indicadores. Conecta pessoas, processos e metas para transformar planos em resultados."
          />

          <TeamCard
            imageSrc="/team/gabriela.png"
            name="Gabriela Pilon Minari"
            role="Cofundadora | Executiva de Operações"
            intro={[
              "Com mais de 15 anos de atuação em projetos de live marketing e atendimento ao cliente, Gabriela transforma estratégias em experiências memoráveis na Straggia Consultoria.",
              "Com sólida experiência no setor hoteleiro, incluindo passagens por Atlantica Hotels e Intercity Hotels, desenvolveu habilidades estratégicas e operacionais que a diferenciam na condução de processos, equipes e recursos, equilibrando planejamento, criatividade e execução precisa.",
              "Sua trajetória inclui coordenação de projetos complexos, liderança de equipes multidisciplinares e gestão de orçamentos, com experiências em iFood-Move, D23 - Disney e CCXP.",
            ]}
            highlights={[
              "Gestão de orçamentos complexos, fornecedores e prazos com SLAs definidos.",
              "Coordenação de equipes multidisciplinares e controle de qualidade de ponta a ponta.",
              "Planejamento, pré-produção e operação em campo de projetos de grande porte.",
            ]}
            focus="Orquestra a operação para garantir previsibilidade e qualidade nas entregas, conectando estratégia, cronograma, recursos e resultados."
          />

          <TeamCard
            imageSrc="/team/viviane.png"
            name="Viviane Mishima"
            role="Consultora Sócia da Straggia | Especialista em Desenvolvimento Humano e Estratégia Organizacional"
            intro={[
              "Com mais de 18 anos de experiência em gestão de pessoas e desenvolvimento organizacional, Viviane Mishima atuou em empresas de diversos setores, dentre elas uma regional líder em alimentos com forte capilaridade logística, rede educacional com milhares de alunos e organização metalúrgica fornecedora B2B para grandes players, conduzindo projetos de reestruturação de RH, liderança de equipes, desenho de cargos e funções e programas de bem-estar e alta performance.",
              "Doutoranda em Psicologia – Saúde e Desenvolvimento (USP/RP) e em Recursos Humanos e Relações Laborais (UniZar, Espanha), mestre em Psicologia (USP/RP), Viviane também é especialista em coaching, análise comportamental e trabalho remoto, com foco em saúde mental e desenvolvimento de líderes e equipes. Sua atuação combina pesquisa científica, aplicação prática e visão estratégica.",
            ]}
            highlights={[
              "Diagnóstico de clima e fit cultural, desenho de cargos, trilhas de desenvolvimento e liderança.",
              "Programas de bem-estar e alta performance com métricas de impacto.",
              "Base científico-aplicada sólida aliada à prática executiva em RH e DHO.",
            ]}
            focus="Alinha estratégia, pessoas e cultura com indicadores de acompanhamento, garantindo resultados consistentes e sustentáveis no longo prazo."
          />
        </section>
      </div>

      {/* Footer (cliente) */}
      <Footer />
    </main>
  )
}

/* =========================
   Componentes auxiliares
   ========================= */

function PillarCard({
  Icon,
  title,
  text,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  text: string
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <Icon className="h-6 w-6 shrink-0 text-primary" strokeWidth={1.75} />
      <div>
        <h3 className="text-lg md:text-xl font-display font-semibold">{title}</h3>
        <p className="mt-1 leading-relaxed text-foreground/80">{text}</p>
      </div>
    </div>
  )
}

function ValueCard({
  Icon,
  title,
  text,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  text: string
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 md:p-6">
      <Icon className="h-6 w-6 shrink-0 text-secondary" strokeWidth={1.75} />
      <div>
        <h3 className="text-lg md:text-xl font-display font-semibold">{title}</h3>
        <p className="mt-1 leading-relaxed text-foreground/80">{text}</p>
      </div>
    </div>
  )
}

function TeamCard({
  imageSrc,
  name,
  role,
  intro,
  highlights,
  focus,
}: {
  imageSrc: string
  name: string
  role: string
  intro: string[]
  highlights: string[]
  focus: string
}) {
  return (
    <article className="mb-6 rounded-2xl border border-border bg-card p-6 md:p-8">
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[280px_1fr] md:gap-8">
        {/* FOTO com Next/Image – padrão aprovado */}
        <div className="w-full">
          <Image
            src={imageSrc}
            alt={name}
            width={600}
            height={600}
            sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 22rem"
            className="w-48 sm:w-72 md:w-80 lg:w-88 h-auto object-contain bg-transparent"
          />
        </div>

        {/* Texto */}
        <div>
          <h3 className="text-3xl font-display font-bold">{name}</h3>
          <p className="mt-1 text-lg text-muted-foreground">{role}</p>

          <div className="mt-6 space-y-4">
            {intro.map((p, i) => (
              <p key={i} className="leading-relaxed text-foreground">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-display font-semibold text-primary">Destaques</h4>
            <ul className="ml-5 mt-3 list-disc space-y-2 leading-relaxed">
              {highlights.map((li, i) => (
                <li key={i}>{li}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-display font-semibold text-primary">Foco na Straggia</h4>
            <p className="mt-2 leading-relaxed">{focus}</p>
          </div>
        </div>
      </div>
    </article>
  )
}