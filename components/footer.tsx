"use client"

import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer id="contato" className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo + descrição */}
          <div className="space-y-4">
            <Image
              src="/brand/logo-vertical.jpg"
              alt="Straggia"
              width={320}
              height={320}
              className="h-36 w-auto"
              priority={false}
            />
            <p className="text-muted-foreground leading-relaxed">
              Consultoria que conecta estratégia à prática com pessoas no centro.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-primary">Navegação</h3>
            <ul className="space-y-2">
              {[
                { name: "Início", href: "/#inicio" },
                { name: "Soluções", href: "/#solucoes" },
                { name: "Método", href: "/#metodo" },
                { name: "Conteúdo", href: "/#conteudo" },
                { name: "Quem somos", href: "/quem-somos" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-display font-semibold mb-4 text-primary">Contato</h3>
            <div className="space-y-3">
              <a
                href="mailto:contato.straggia@gmail.com"
                className="block text-muted-foreground hover:text-primary transition-colors"
                aria-label="Enviar email para contato.straggia@gmail.com"
              >
                contato.straggia@gmail.com
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
          <p className="text-muted-foreground">
            {currentYear} Straggia. Estratégia em Movimento.
          </p>
        </div>
      </div>
    </footer>
  )
}