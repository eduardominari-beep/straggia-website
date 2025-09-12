import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const solutions = [
  {
    title: "Architecta",
    description: "Estruturação organizacional e definição de processos para crescimento sustentável.",
    icon: "🏗️",
  },
  {
    title: "Atracta",
    description: "Estratégias de atração e retenção de talentos alinhadas à cultura organizacional.",
    icon: "🎯",
  },
  {
    title: "Efficentia",
    description: "Otimização de processos e implementação de metodologias de alta performance.",
    icon: "⚡",
  },
  {
    title: "Evolvia",
    description: "Transformação digital e evolução contínua dos modelos de negócio.",
    icon: "🚀",
  },
]

export function SolutionsSection() {
  return (
    <section id="solucoes" className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-balance mb-4">
            Nossas <span className="text-primary">Soluções</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
            Metodologias comprovadas para transformar desafios em oportunidades de crescimento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <Card key={index} className="bg-background border-border hover:border-primary transition-colors group">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{solution.icon}</div>
                <CardTitle className="text-primary text-xl font-display">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {solution.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
