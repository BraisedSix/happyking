"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black"></div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">{t("heroTitle1")}</span>
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  {t("heroTitle2")}
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-xl text-gray-300">{t("heroDescription")}</p>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                onClick={() => router.push("/projects")}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700"
                size="lg"
              >
                {t("exploreProjects")}
              </Button>
              <Button
                onClick={() => router.push("/create")}
                variant="outline"
                size="lg"
                className="border-gray-700 bg-black/50 text-white hover:bg-gray-900"
              >
                {t("createProject")}
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-green-400"></div>
                {t("projectsLaunched", { count: "1,234" })}
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 rounded-full bg-purple-400"></div>
                {t("activeUsers", { count: "56K+" })}
              </div>
            </div>
          </div>
          <div className="relative mx-auto h-[400px] w-[400px]">
            <Image
              src="/placeholder.svg?key=t0qjy"
              alt="Happy King Platform"
              width={400}
              height={400}
              className="rounded-lg object-cover shadow-2xl"
              priority
            />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-cyan-500/30 blur-xl"></div>
            <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-purple-500/30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
