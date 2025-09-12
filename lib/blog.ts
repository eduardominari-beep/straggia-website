export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  content: string
}

// Static blog data for preview - in production this would read from MDX files
const staticPosts: BlogPost[] = [
  {
    slug: "okr-bussola",
    title: "Por que OKRs são bússola, não cura",
    date: "2024-01-15",
    description:
      "Entenda como usar OKRs de forma estratégica para navegar em direção aos seus objetivos, sem cair na armadilha de tratá-los como solução mágica.",
    tags: ["OKR", "Estratégia", "Gestão"],
    content: `# Por que OKRs são bússola, não cura

Os **Objectives and Key Results (OKRs)** se tornaram uma das metodologias de gestão mais populares dos últimos anos. Empresas de todos os tamanhos adotam essa ferramenta esperando transformações imediatas em seus resultados. Mas aqui está o problema: **OKRs não são uma cura milagrosa**.

## A diferença entre ferramenta e solução

Muitas organizações implementam OKRs como se fossem um remédio para todos os males empresariais:

- Falta de alinhamento entre equipes
- Baixa produtividade
- Ausência de foco estratégico
- Dificuldade em medir resultados

A realidade é que **OKRs são uma bússola**, não um motor. Eles indicam a direção, mas não fornecem a energia necessária para chegar ao destino.

## Como usar OKRs como bússola

### 1. Defina o Norte Verdadeiro

Antes de criar qualquer OKR, sua organização precisa ter clareza sobre:

- **Visão de longo prazo**: Onde queremos estar em 3-5 anos?
- **Propósito**: Por que existimos como organização?
- **Valores**: Como tomamos decisões no dia a dia?

### 2. Conecte estratégia à execução

Os melhores OKRs fazem a ponte entre a estratégia de alto nível e as ações práticas:

> "Um bom OKR responde: se fizermos isso (Key Results), alcançaremos aquilo (Objective) e estaremos mais próximos da nossa visão."

### 3. Mantenha o foco no essencial

A tentação é criar OKRs para tudo. Resista. **Menos é mais**:

- Máximo 3-5 Objectives por trimestre
- 2-4 Key Results por Objective
- Foque no que realmente move a agulha

## Conclusão

OKRs são uma ferramenta poderosa quando usados corretamente. Eles trazem clareza, alinhamento e foco. Mas lembre-se: **uma bússola só é útil se você souber para onde quer ir e estiver disposto a caminhar**.

O sucesso não vem dos OKRs em si, mas da disciplina, cultura e liderança que os sustentam.`,
  },
  {
    slug: "operacao-sustentavel",
    title: "Do apagar incêndios à operação sustentável",
    date: "2024-01-10",
    description:
      "Como transformar uma gestão reativa em um sistema proativo e sustentável que previne crises ao invés de apenas reagir a elas.",
    tags: ["Gestão", "Processos", "Sustentabilidade"],
    content: `# Do apagar incêndios à operação sustentável

Se você é gestor, provavelmente já viveu isso: o dia começa com uma reunião planejada, mas antes mesmo do café esfriar, três "urgências" aparecem na sua mesa. O planejamento vai para o segundo plano e você passa o dia **apagando incêndios**.

Esse ciclo vicioso é mais comum do que imaginamos. Mas existe uma saída: **transformar operações reativas em sistemas sustentáveis**.

## O ciclo do apagar incêndios

### Como começamos aqui?

A gestão reativa geralmente surge de:

1. **Crescimento rápido sem estrutura**: A empresa cresce, mas os processos não acompanham
2. **Cultura do herói**: Valorizar quem "salva o dia" ao invés de quem previne problemas
3. **Falta de visibilidade**: Não sabemos onde estão os gargalos até eles explodirem
4. **Pressão por resultados imediatos**: Foco no curto prazo compromete o longo prazo

### Os custos ocultos

Operar no modo "apagar incêndios" tem custos que vão além do óbvio:

- **Burnout da equipe**: Stress constante reduz produtividade e aumenta turnover
- **Qualidade comprometida**: Soluções rápidas geram retrabalho
- **Perda de oportunidades**: Tempo gasto em crises não é investido em crescimento
- **Cultura tóxica**: Ambiente de urgência constante afeta o clima organizacional

## A transição para operação sustentável

### 1. Mapeie os incêndios recorrentes

Antes de prevenir, você precisa entender:

- **Quais problemas se repetem?** Identifique padrões nos "urgentes"
- **Onde eles se originam?** Trace a causa raiz, não apenas os sintomas
- **Qual o custo real?** Calcule tempo, recursos e impacto na equipe

> "Não existe problema novo, apenas problema mal resolvido que volta."

### 2. Implemente sistemas de prevenção

#### Processos padronizados
- Documente fluxos críticos
- Crie checklists para atividades recorrentes
- Estabeleça pontos de controle e validação

#### Indicadores preditivos
- Monitore métricas que antecipam problemas
- Configure alertas automáticos
- Crie dashboards de acompanhamento

## Conclusão

A diferença entre **apagar incêndios** e **operação sustentável** não está na ausência de problemas, mas na capacidade de antecipá-los e resolvê-los de forma estruturada.

O caminho não é fácil e exige disciplina. Mas os resultados compensam: uma organização mais resiliente, uma equipe mais engajada e líderes com tempo para pensar estrategicamente.`,
  },
]

export function getAllPosts(): BlogPost[] {
  // In production, this would read from the filesystem
  // For preview, we use static data
  return staticPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): BlogPost | null {
  // In production, this would read from the filesystem
  // For preview, we use static data
  return staticPosts.find((post) => post.slug === slug) || null
}

export function getRecentPosts(limit = 2): BlogPost[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, limit)
}
