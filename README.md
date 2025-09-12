# Straggia - Website Profissional

Website profissional da Straggia, consultoria que conecta estratégia à prática, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **MDX** com gray-matter e next-mdx-remote
- **shadcn/ui** para componentes

## 📁 Estrutura do Projeto

\`\`\`
├── app/                    # App Router do Next.js
│   ├── blog/              # Páginas do blog
│   ├── api/health/        # API de health check
│   ├── sitemap.ts         # Sitemap automático
│   ├── robots.ts          # Robots.txt
│   └── page.tsx           # Homepage
├── components/            # Componentes React
├── content/posts/         # Artigos do blog em MDX (para produção)
├── lib/                   # Utilitários e funções
├── public/brand/          # Assets da marca
└── README.md
\`\`\`

## 🎨 Design System

### Cores
- **Background**: #0b0b0d (escuro elegante)
- **Cards**: #121316 (cinza escuro)
- **Accent Primary**: #31d0c6 (turquesa)
- **Accent Secondary**: #ff6a23 (laranja)

### Tipografia
- **Display**: Poppins (títulos e destaques)
- **Text**: Inter (corpo do texto)

## 📝 Sistema de Blog

### Versão Preview
Na versão de preview (v0), o blog usa dados estáticos definidos em \`lib/blog.ts\` para demonstração.

### Versão Produção
Para usar o sistema completo de MDX em produção:

1. **Instale as dependências MDX**:
\`\`\`bash
npm install gray-matter next-mdx-remote
\`\`\`

2. **Substitua o conteúdo de \`lib/blog.ts\`** pela versão que lê arquivos MDX:

\`\`\`typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export function getAllPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || '',
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || [],
        content,
      } as BlogPost
    })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}
\`\`\`

3. **Crie arquivos MDX** em \`content/posts/\`:

\`\`\`mdx
---
title: "Meu Novo Artigo"
date: "2024-01-20"
description: "Uma breve descrição do que o artigo aborda"
tags: ["Estratégia", "Gestão"]
---

# Meu Novo Artigo

Conteúdo do artigo em Markdown...
\`\`\`

## 🖼️ Como Trocar Imagens da Marca

Substitua os arquivos em \`public/brand/\`:

- \`logo-horizontal.jpg\` - Logo horizontal (navbar)
- \`logo-vertical.jpg\` - Logo vertical (footer)
- \`og-image.jpg\` - Imagem para redes sociais (1200x630px)

## ⚙️ Variáveis de Ambiente

Crie um arquivo \`.env.local\` com:

\`\`\`env
# URL do site (para SEO e sitemap)
NEXT_PUBLIC_SITE_URL=https://straggia.com

# URL do Google Forms para pré-diagnóstico (opcional)
NEXT_PUBLIC_GFORM_EMBED_URL=https://docs.google.com/forms/d/e/...
\`\`\`

### Configuração do Google Forms

1. Crie um formulário no Google Forms
2. Vá em "Enviar" > "Incorporar HTML"
3. Copie a URL do \`src\` do iframe
4. Adicione em \`NEXT_PUBLIC_GFORM_EMBED_URL\`

## 🚀 Comandos

\`\`\`bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar build de produção
pnpm start

# Linting
pnpm lint
\`\`\`

## 📱 Funcionalidades

### Homepage
- **Hero Section**: Apresentação principal com CTAs
- **Soluções**: Cards das 4 soluções (Architecta, Atracta, Efficentia, Evolvia)
- **Método**: Timeline dos 5 passos do processo
- **Conteúdo**: Últimos posts do blog
- **Pré-Diagnóstico**: Formulário integrado do Google Forms
- **Contato**: Footer com informações de contato

### Blog
- **Lista de posts**: \`/blog\` - Todos os artigos
- **Post individual**: \`/blog/[slug]\` - Artigo completo
- **Renderização MDX**: Suporte completo a Markdown (em produção)
- **SEO otimizado**: Meta tags automáticas

### SEO
- **Sitemap automático**: Inclui todas as páginas e posts
- **Robots.txt**: Configuração para crawlers
- **Meta tags**: Open Graph e Twitter Cards
- **URLs amigáveis**: Estrutura limpa e semântica

### Acessibilidade
- **Navegação por teclado**: Todos os elementos focáveis
- **ARIA labels**: Descrições para screen readers
- **Contraste adequado**: Cores seguem WCAG 2.1
- **Texto alternativo**: Todas as imagens têm alt text

## 🔧 Personalização

### Cores
Edite as variáveis CSS em \`app/globals.css\`:

\`\`\`css
:root {
  --background: #0b0b0d;
  --primary: #31d0c6;
  --secondary: #ff6a23;
  /* ... outras cores */
}
\`\`\`

### Conteúdo
- **Textos da homepage**: Edite os componentes em \`components/\`
- **Informações de contato**: Atualize em \`components/footer.tsx\`
- **Links do WhatsApp**: Substitua o número em todos os componentes

## 📞 Suporte

Para dúvidas sobre implementação ou customização:
- Email: contato@straggia.com
- WhatsApp: (16) 99631-7472

---

Desenvolvido com ❤️ para a Straggia
\`\`\`
