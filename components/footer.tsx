"use client"

import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer id="contato" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Image src="/brand/logo-vertical.jpg" alt="Straggia" width={120} height={120} className="h-16 w-auto" />
            <p className="text-muted-foreground leading-relaxed">
              Consultoria que conecta estratégia à prática com pessoas no centro.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-primary">Navegação</h3>
            <ul className="space-y-2">
              {[
                { name: "Início", href: "#inicio" },
                { name: "Soluções", href: "#solucoes" },
                { name: "Método", href: "#metodo" },
                { name: "Conteúdo", href: "#conteudo" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-primary">Contato</h3>
            <div className="space-y-3">
              <a
                href="mailto:contato@straggia.com"
                className="block text-muted-foreground hover:text-primary transition-colors"
                aria-label="Enviar email para contato@straggia.com"
              >
                contato@straggia.com
              </a>
              <a
                href="https://wa.me/5516996317472"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-secondary transition-colors"
                aria-label="Entrar em contato via WhatsApp"
              >
                WhatsApp: (16) 99631-7472
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© {currentYear} Straggia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
