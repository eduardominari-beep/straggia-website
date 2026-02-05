"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { YoutubeLink } from "@/components/youtube-link"

const navigation = [
  { name: "Início", href: "#inicio" },
  { name: "Soluções", href: "#solucoes" },
  { name: "Método", href: "#metodo" },
  { name: "Conteúdo", href: "#conteudo" },
  { name: "Contato", href: "#contato" },
  { name: "Quem somos", href: "/quem-somos" },
]

// calcula a altura real do header + um respiro
function headerOffset() {
  const el = document.getElementById("site-header")
  if (!el) return 90
  return el.getBoundingClientRect().height + 12
}

function scrollWithOffset(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - headerOffset()
  window.scrollTo({ top: y, behavior: "smooth" })
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [spacerH, setSpacerH] = useState<number>(0)
  const pathname = usePathname()
  const router = useRouter()

  // mede a altura real do header p/ espaçador e offset
  const measureHeader = () => {
    const el = document.getElementById("site-header")
    if (!el) return
    setSpacerH(el.getBoundingClientRect().height)
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll)
    window.addEventListener("resize", measureHeader)
    measureHeader()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", measureHeader)
    }
  }, [])

  // quando chegamos em /#algumaCoisa (vindo de outra rota), corrige o offset
  useEffect(() => {
    const fixHash = () => {
      if (location.hash) {
        requestAnimationFrame(() => {
          scrollWithOffset(location.hash)
        })
      }
      measureHeader()
    }
    fixHash()
    window.addEventListener("hashchange", fixHash)
    return () => window.removeEventListener("hashchange", fixHash)
  }, [])

  const handleNav = (href: string) => {
    if (!href.startsWith("#")) {
      router.push(href) // rota normal (ex: /quem-somos)
      return
    }
    if (pathname === "/") {
      scrollWithOffset(href) // mesma página
    } else {
      router.push("/" + href) // outra página; o efeito acima ajusta o offset
    }
  }

  return (
    <>
      <nav
        id="site-header"
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Sem altura fixa: apenas padding vertical p/ a logo grande */}
          <div className="flex items-center justify-between pt-6 md:pt-7 lg:pt-8 pb-7 md:pb-8 lg:pb-9">
            <Link href="/#inicio" className="shrink-0" aria-label="Ir para o início">
              <Image
                src="/brand/logo-horizontal.jpg"
                alt="Straggia"
                width={1200}
                height={300}
                priority
                className="h-28 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navigation.map((item) =>
                item.href.startsWith("#") ? (
                  <button
                    key={item.name}
                    onClick={() => handleNav(item.href)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                    aria-label={`Ir para ${item.name}`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                ),
              )}

              {/* CTA primário: Agendar conversa (substitui Pré-Diagnóstico) */}
              {/* YouTube */}
              <YoutubeLink />
              <Button asChild className="ml-2 bg-primary text-primary-foreground hover:bg-primary/90">
                 <Link href="/agenda">Agendar conversa</Link>
               </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Espaçador dinâmico = altura real do header */}
      <div aria-hidden style={{ height: spacerH }} />
    </>
  )
}