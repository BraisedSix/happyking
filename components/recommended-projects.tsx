"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlameIcon as Fire, MessageSquare, Users, Award, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for recommended projects
const mockProjects = [
  {
    id: 5,
    name: "Crypto Exchange",
    description: "Next-generation decentralized exchange with low fees",
    logo: "/placeholder.svg?height=80&width=80&query=abstract logo with C letter",
    heatValue: 5432,
    comments: 76,
    participants: 543,
    tokenReward: "250 CEX",
    category: "Exchange",
    isSponsored: true,
  },
  {
    id: 6,
    name: "AI Protocol",
    description: "Decentralized artificial intelligence marketplace",
    logo: "/placeholder.svg?height=80&width=80&query=abstract logo with A letter",
    heatValue: 4321,
    comments: 65,
    participants: 432,
    tokenReward: "150 AIP",
    category: "AI",
    isSponsored: true,
  },
  {
    id: 7,
    name: "Privacy Chain",
    description: "Zero-knowledge proof blockchain for privacy-focused applications",
    logo: "/placeholder.svg?height=80&width=80&query=abstract logo with P letter",
    heatValue: 3210,
    comments: 54,
    participants: 321,
    tokenReward: "100 PRC",
    category: "Privacy",
    isSponsored: false,
  },
]

export default function RecommendedProjects() {
  const { t } = useLanguage()

  return (
    <section className="py-10">
      <div className="mb-8">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-white">{t("recommendedProjects")}</h2>
          <Badge variant="outline" className="ml-3 border-purple-500 bg-purple-500/10 text-purple-400">
            <Sparkles className="mr-1 h-3 w-3" />
            {t("sponsored")}
          </Badge>
        </div>
        <p className="text-gray-400">{t("recommendedProjectsDescription")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {mockProjects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="h-full overflow-hidden border-gray-800 bg-black/50 transition-all duration-200 hover:border-purple-900 hover:shadow-lg hover:shadow-purple-900/20">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={project.logo || "/placeholder.svg"}
                      alt={project.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div>
                      <CardTitle className="flex items-center text-lg text-white">
                        {project.name}
                        {project.isSponsored && <Sparkles className="ml-2 h-4 w-4 text-purple-400" />}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-400">
                    <Fire className="h-3 w-3" />
                    <span>{project.heatValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-2 text-sm text-gray-400">{project.description}</p>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-gray-800 pt-4">
                <div className="flex space-x-3 text-xs text-gray-400">
                  <div className="flex items-center">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {project.comments}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-3 w-3" />
                    {project.participants}
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs font-medium text-green-400">
                  <Award className="h-3 w-3" />
                  <span>{project.tokenReward}</span>
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
