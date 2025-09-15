"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Início", href: "#inicio" },
  { name: "Soluções", href: "#solucoes" },
  { name: "Método", href: "#metodo" },
  { name: "Conteúdo", href: "#conteudo" },
  { name: "Contato", href: "#contato" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [navH, setNavH] = useState(0)
  const navRef = useRef<HTMLElement>(null)

  // mede a altura real da navbar (para compensar na rolagem)
  const measure = () => setNavH(navRef.current?.getBoundingClientRect().height ?? 0)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll)
    window.addEventListener("resize", measure)
    window.addEventListener("load", measure)
    measure()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measure)
      window.removeEventListener("load", measure)
    }
  }, [])

  // rola até a seção compensando exatamente a altura da navbar
  const scrollToSection = (href: string) => {
    const el = document.querySelector(href) as HTMLElement | null
    if (!el) return
    const y = window.scrollY + el.getBoundingClientRect().top - navH - 6 // 6px de respiro
    window.scrollTo({ top: y, behavior: "smooth" })
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Altura “média” do header (tamanho anterior) */}
          <div className="flex items-center justify-between h-28 md:h-32 lg:h-40">
            {/* Logo em tamanho moderado */}
            <a
              href="#inicio"
              className="shrink-0"
              aria-label="Straggia"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("#inicio")
              }}
            >
              <Image
                src="/brand/logo-horizontal.jpg"
                alt="Straggia"
                width={1200}
                height={300}
                priority
                className="w-auto h-20 md:h-24 lg:h-28"
              />
            </a>

            {/* Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                    aria-label={`Navegar para ${item.name}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="hidden md:block">
              <Button
                onClick={() => scrollToSection("#pre-diagnostico")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Pré-Diagnóstico
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer dinâmico: evita que o topo do hero fique escondido */}
      <div aria-hidden style={{ height: navH }} />
    </>
  )
}