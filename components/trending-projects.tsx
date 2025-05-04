"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlameIcon as Fire, MessageSquare, Users, ArrowUpRight, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for trending projects
const mockProjects = [
  {
    id: 1,
    name: "MetaVerse DAO",
    description: "A decentralized autonomous organization for metaverse governance",
    logo: "/placeholder.svg?key=x9jj3",
    heatValue: 9823,
    comments: 156,
    participants: 1245,
    tokenReward: "500 MVT",
    category: "DAO",
    isVerified: true,
  },
  {
    id: 2,
    name: "DeFi Pulse",
    description: "Real-time analytics and rankings of DeFi protocols",
    logo: "/placeholder.svg?key=5ruu7",
    heatValue: 8756,
    comments: 132,
    participants: 987,
    tokenReward: "300 DFP",
    category: "DeFi",
    isVerified: true,
  },
  {
    id: 3,
    name: "NFT Marketplace",
    description: "Create, buy, and sell unique digital assets",
    logo: "/placeholder.svg?key=my0ix",
    heatValue: 7654,
    comments: 98,
    participants: 765,
    tokenReward: "200 NFTM",
    category: "NFT",
    isVerified: false,
  },
  {
    id: 4,
    name: "GameFi World",
    description: "Play-to-earn blockchain games ecosystem",
    logo: "/placeholder.svg?key=d70kh",
    heatValue: 6543,
    comments: 87,
    participants: 654,
    tokenReward: "400 GFW",
    category: "GameFi",
    isVerified: true,
  },
]

export default function TrendingProjects() {
  const { t } = useLanguage()
  const [timeframe, setTimeframe] = useState("daily")

  return (
    <section className="py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{t("trendingProjects")}</h2>
          <p className="text-gray-400">{t("trendingProjectsDescription")}</p>
        </div>
        <Tabs defaultValue="daily" className="w-[300px]" onValueChange={setTimeframe}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">{t("daily")}</TabsTrigger>
            <TabsTrigger value="weekly">{t("weekly")}</TabsTrigger>
            <TabsTrigger value="monthly">{t("monthly")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockProjects.map((project) => (
          <Link href={`/projects/${project.id}`} key={project.id}>
            <Card className="h-full overflow-hidden border-gray-800 bg-black/50 transition-all duration-200 hover:border-cyan-900 hover:shadow-lg hover:shadow-cyan-900/20">
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
                        {project.isVerified && (
                          <Badge variant="outline" className="ml-2 border-cyan-500 bg-cyan-500/10 text-cyan-400">
                            {t("verified")}
                          </Badge>
                        )}
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

      <div className="mt-8 flex justify-center">
        <Button variant="outline" className="border-gray-700 bg-black/50 text-white hover:bg-gray-900">
          {t("viewAllProjects")} <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}
