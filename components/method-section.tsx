const methodSteps = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Ouvimos pessoas, analisamos dados e mapeamos processos para revelar os verdadeiros pontos de alavancagem.",
  },
  {
    step: "02",
    title: "Sistema de Gestão",
    description: "Estruturamos objetivos, rotinas e fóruns que conectam estratégia à prática, alinhando visão e execução.",
  },
  {
    step: "03",
    title: "Execução Guiada",
    description: "Acompanhamos os ritos de gestão, conduzindo ações com ritmo, foco e correção de rota para gerar impacto real.",
  },
  {
    step: "04",
    title: "Padronização",
    description: "Consolidamos práticas eficazes em novos padrões de excelência que permanecem no dia a dia.",
  },
  {
    step: "05",
    title: "Transferência",
    description: "Deixamos legado com playbooks, treinamentos e mentoria que preparam os times para sustentar e ampliar resultados.",
  },
]

export function MethodSection() {
  return (
    <section id="metodo" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-balance mb-4">
            Nosso <span className="text-secondary">Método</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Um processo estruturado em 5 etapas para garantir resultados duradouros
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {methodSteps.map((step, index) => (
              <div key={index} className="relative text-center group">
                {/* Step circle */}
                <div className="relative z-10 w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-lg group-hover:bg-secondary transition-colors">
                  {step.step}
                </div>

                <h3 className="text-xl font-display font-semibold mb-2 text-primary group-hover:text-secondary transition-colors">
                  {step.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
