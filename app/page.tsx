import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrendingProjects from "@/components/trending-projects"
import RecommendedProjects from "@/components/recommended-projects"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <TrendingProjects />
        <RecommendedProjects />
      </div>
      <Footer />
    </main>
  )
}
