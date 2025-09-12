"use client"

import { useState, useEffect } from "react"
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Image src="/brand/logo-horizontal.jpg" alt="Straggia" width={120} height={40} className="h-8 w-auto" />
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-accent hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  aria-label={`Navegar para ${item.name}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("#pre-diagnostico")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Pré-Diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
