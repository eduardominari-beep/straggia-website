import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SolutionsSection } from "@/components/solutions-section"
import { MethodSection } from "@/components/method-section"
import { ContentSection } from "@/components/content-section"
import { PreDiagnosticoSection } from "@/components/pre-diagnostico-section"
import { Footer } from "@/components/footer"
import { getRecentPosts } from "@/lib/blog"

export default function HomePage() {
  // Get recent posts on server side
  const recentPosts = getRecentPosts(2)

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SolutionsSection />
      <MethodSection />
      <ContentSection recentPosts={recentPosts} />
      <PreDiagnosticoSection />
      <Footer />
    </main>
  )
}
