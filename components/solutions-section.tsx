import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Megaphone, Wallet, Settings, Users2 } from "lucide-react"

export function SolutionsSection() {
  const solutions = [
    {
      key: "architecta",
      title: "Architecta – Estratégia e Modelagem de Negócios",
      shortTitle: "Architecta",
      description:
        "Do zero ou em transformação, a Architecta ajuda organizações a nascerem ou se reinventarem com clareza. Estruturamos modelos de negócio, definimos objetivos estratégicos e criamos a governança necessária para que cada decisão tenha direção e consistência.",
      ideal:
        "Ideal para: abertura de novos negócios, expansão de unidades ou remodelagem de empresas já existentes.",
      Icon: Building2,
    },
   {
      key: "culturae",
      title: "Culturae – Gestão de Pessoas & Cultura Organizacional",
      shortTitle: "Culturae",
      description:
        "A força de uma organização está nas pessoas que a constroem todos os dias. A Culturae fortalece sua marca empregadora, mede engajamento, cria programas de evolução de talentos e implanta práticas que garantem retenção e crescimento sustentado.",
      ideal:
        "Ideal para: negócios que querem atrair, engajar e manter os melhores profissionais.",
      Icon: Users2,
    },
    {
      key: "atracta",
      title: "Atracta – Marketing, Comercial & Customer Experience",
      shortTitle: "Atracta",
      description:
        "Crescimento previsível só acontece quando posicionamento e mercado estão em sintonia. A Atracta redesenha jornadas de clientes, estrutura funis da aquisição à retenção e organiza métricas comerciais que sustentam resultados duradouros.",
      ideal:
        "Ideal para: empresas que querem atrair, converter e fidelizar clientes com eficiência.",
      Icon: Megaphone,
    },
    {
      key: "efficentia",
      title: "Efficentia – Eficiência em Gastos",
      shortTitle: "Efficentia",
      description:
        "Mais margem, mais caixa, mais fôlego para crescer. A Efficentia identifica desperdícios, renegocia fornecedores, prioriza investimentos e implanta controles que liberam recursos sem comprometer qualidade.",
      ideal:
        "Ideal para: organizações que precisam enxugar custos de forma inteligente.",
      Icon: Wallet,
    },
    {
      key: "evolvia",
      title: "Evolvia – Redesenho e Melhoria de Processos",
      shortTitle: "Evolvia",
      description:
        "Quando os processos não entregam a velocidade ou a qualidade que o negócio exige, entra a Evolvia. Mapeamos e reestruturamos fluxos críticos, eliminamos atividades que não agregam valor e identificamos oportunidades de automação ou outsourcing/BPO que ampliam a eficiência.",
      ideal:
        "Ideal para: empresas que buscam produtividade, eficiência e novos modelos de operação.",
      Icon: Settings,
    },
  ]

  return (
    // scroll-mt-* garante que o anchor do menu não “corte” o topo por causa da navbar fixa
    <section id="solucoes" className="py-20 bg-background scroll-mt-24 md:scroll-mt-28 lg:scroll-mt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-balance">
            <span className="text-foreground">Nossas </span>
            <span className="text-primary">Soluções</span>
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Metodologias comprovadas para transformar desafios em oportunidades de crescimento
          </p>
        </div>

        {/* Lista vertical — um card por linha */}
        <div className="space-y-8">
          {solutions.map(({ key, shortTitle, description, ideal, Icon }) => (
            <Card
              key={key}
              className="rounded-2xl bg-card border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6 md:p-8 lg:p-10">
                <div className="md:flex md:items-start md:gap-8">
                  {/* Ícone maior, com cor de destaque */}
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <Icon className="h-12 w-12 md:h-14 md:w-14 text-primary" strokeWidth={1.8} />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <CardHeader className="p-0">
                      <CardTitle className="text-2xl md:text-3xl font-display text-foreground">
                        {shortTitle}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0 mt-4">
                      <p className="text-lg leading-relaxed text-foreground/85">
                        {description}
                      </p>
                      <p className="mt-4 text-sm md:text-base text-muted-foreground">
                        {ideal}
                      </p>
                    </CardContent>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}