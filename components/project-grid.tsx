"use client"

import { CardFooter } from "@/components/ui/card"

import { CardContent } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import ProjectCard from "@/components/project-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"
import { useProjectStore } from "@/store/project-store"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useEffect, useState } from "react"

// Mock data for projects
// const mockProjects = [
//   {
//     id: 1,
//     name: "MetaVerse DAO",
//     description: "A decentralized autonomous organization for metaverse governance",
//     logo: "/placeholder.svg?key=x9jj3",
//     heatValue: 9823,
//     comments: 156,
//     participants: 1245,
//     tokenReward: "500 MVT",
//     category: "DAO",
//     isVerified: true,
//     createdAt: "2023-04-15T10:30:00Z",
//   },
//   {
//     id: 2,
//     name: "DeFi Pulse",
//     description: "Real-time analytics and rankings of DeFi protocols",
//     logo: "/placeholder.svg?key=5ruu7",
//     heatValue: 8756,
//     comments: 132,
//     participants: 987,
//     tokenReward: "300 DFP",
//     category: "DeFi",
//     isVerified: true,
//     createdAt: "2023-04-14T08:45:00Z",
//   },
//   {
//     id: 3,
//     name: "NFT Marketplace",
//     description: "Create, buy, and sell unique digital assets",
//     logo: "/placeholder.svg?key=my0ix",
//     heatValue: 7654,
//     comments: 98,
//     participants: 765,
//     tokenReward: "200 NFTM",
//     category: "NFT",
//     isVerified: false,
//     createdAt: "2023-04-13T14:20:00Z",
//   },
//   {
//     id: 4,
//     name: "GameFi World",
//     description: "Play-to-earn blockchain games ecosystem",
//     logo: "/placeholder.svg?key=d70kh",
//     heatValue: 6543,
//     comments: 87,
//     participants: 654,
//     tokenReward: "400 GFW",
//     category: "GameFi",
//     isVerified: true,
//     createdAt: "2023-04-12T11:15:00Z",
//   },
//   {
//     id: 5,
//     name: "Crypto Exchange",
//     description: "Next-generation decentralized exchange with low fees",
//     logo: "/placeholder.svg?key=mcat9",
//     heatValue: 5432,
//     comments: 76,
//     participants: 543,
//     tokenReward: "250 CEX",
//     category: "Exchange",
//     isVerified: true,
//     createdAt: "2023-04-11T09:30:00Z",
//   },
//   {
//     id: 6,
//     name: "AI Protocol",
//     description: "Decentralized artificial intelligence marketplace",
//     logo: "/placeholder.svg?key=c67zp",
//     heatValue: 4321,
//     comments: 65,
//     participants: 432,
//     tokenReward: "150 AIP",
//     category: "AI",
//     isVerified: false,
//     createdAt: "2023-04-10T16:45:00Z",
//   },
//   {
//     id: 7,
//     name: "Privacy Chain",
//     description: "Zero-knowledge proof blockchain for privacy-focused applications",
//     logo: "/placeholder.svg?key=sqbzd",
//     heatValue: 3210,
//     comments: 54,
//     participants: 321,
//     tokenReward: "100 PRC",
//     category: "Privacy",
//     isVerified: false,
//     createdAt: "2023-04-09T13:20:00Z",
//   },
//   {
//     id: 8,
//     name: "Social Token",
//     description: "Tokenized social media platform with creator rewards",
//     logo: "/placeholder.svg?key=pv0f3",
//     heatValue: 2987,
//     comments: 43,
//     participants: 298,
//     tokenReward: "350 SOT",
//     category: "Social",
//     isVerified: true,
//     createdAt: "2023-04-08T10:15:00Z",
//   },
//   {
//     id: 9,
//     name: "Infrastructure Protocol",
//     description: "Scalable blockchain infrastructure for Web3 applications",
//     logo: "/placeholder.svg?key=k8e23",
//     heatValue: 2765,
//     comments: 38,
//     participants: 276,
//     tokenReward: "200 INP",
//     category: "Infrastructure",
//     isVerified: true,
//     createdAt: "2023-04-07T14:30:00Z",
//   },
//   {
//     id: 10,
//     name: "Metaverse Land",
//     description: "Virtual real estate platform in the metaverse",
//     logo: "/placeholder.svg?key=nat5s",
//     heatValue: 2543,
//     comments: 32,
//     participants: 254,
//     tokenReward: "180 MVL",
//     category: "Metaverse",
//     isVerified: false,
//     createdAt: "2023-04-06T09:45:00Z",
//   },
//   {
//     id: 11,
//     name: "DeFi Lending",
//     description: "Decentralized lending and borrowing platform",
//     logo: "/placeholder.svg?key=6h43u",
//     heatValue: 2321,
//     comments: 29,
//     participants: 232,
//     tokenReward: "120 DFL",
//     category: "DeFi",
//     isVerified: true,
//     createdAt: "2023-04-05T11:30:00Z",
//   },
//   {
//     id: 12,
//     name: "NFT Gaming",
//     description: "Gaming platform with NFT integration and play-to-earn mechanics",
//     logo: "/placeholder.svg?key=ywt07",
//     heatValue: 2109,
//     comments: 26,
//     participants: 210,
//     tokenReward: "150 NFG",
//     category: "GameFi",
//     isVerified: false,
//     createdAt: "2023-04-04T15:20:00Z",
//   },
// ]

interface ProjectGridProps {
  searchQuery: string
  activeFilters: {
    category: string
    sortBy: string
    timeframe: string
    verified: boolean
  }
  currentPage: number
  onPageChange: (page: number) => void
}

export default function ProjectGrid({ searchQuery, activeFilters, currentPage, onPageChange }: ProjectGridProps) {
  const { t } = useLanguage()
  const { projects } = useProjectStore()
  const [isLoading, setIsLoading] = useState(true)
  const [filteredProjects, setFilteredProjects] = useState(projects)

  const projectsPerPage = 12
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Filter and sort projects based on search query and active filters
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      let filtered = [...projects]

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (project) => project.name.toLowerCase().includes(query) || project.description.toLowerCase().includes(query),
        )
      }

      // Apply category filter
      if (activeFilters.category !== "all") {
        filtered = filtered.filter((project) => project.category.toLowerCase() === activeFilters.category.toLowerCase())
      }

      // Apply verified filter
      if (activeFilters.verified) {
        filtered = filtered.filter((project) => project.isVerified)
      }

      // Apply timeframe filter
      if (activeFilters.timeframe !== "all" && filtered[0]?.createdAt) {
        const now = new Date()
        const cutoffDate = new Date()

        switch (activeFilters.timeframe) {
          case "today":
            cutoffDate.setDate(now.getDate() - 1)
            break
          case "week":
            cutoffDate.setDate(now.getDate() - 7)
            break
          case "month":
            cutoffDate.setMonth(now.getMonth() - 1)
            break
          default:
            break
        }

        filtered = filtered.filter((project) => {
          if (!project.createdAt) return true
          const projectDate = new Date(project.createdAt)
          return projectDate >= cutoffDate
        })
      }

      // Apply sorting
      if (activeFilters.sortBy === "heat") {
        filtered.sort((a, b) => b.heatValue - a.heatValue)
      } else if (activeFilters.sortBy === "newest" && filtered[0]?.createdAt) {
        filtered.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
      }

      setFilteredProjects(filtered)
      setIsLoading(false)
    }, 500) // Simulate loading delay

    return () => clearTimeout(timer)
  }, [searchQuery, activeFilters, projects])

  // Render loading skeletons
  if (isLoading) {
    return (
      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="border-gray-800 bg-black/50">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div>
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-1 h-4 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="flex space-x-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  // No results found
  if (filteredProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-800/50 p-6">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mt-4 text-xl font-medium">{t("noProjectsFound")}</h3>
        <p className="mt-2 max-w-md text-gray-400">{t("tryDifferentSearch")}</p>
        <Button
          onClick={() => {
            onPageChange(1)
            // Reset filters
            // This would typically be handled by the parent component
          }}
          variant="outline"
          className="mt-6 border-gray-700 bg-black/50 text-white hover:bg-gray-900"
        >
          {t("clearFilters")}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gray-800 bg-black/50 text-white hover:bg-gray-900"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Show first page, last page, current page, and pages around current page
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={`h-8 w-8 ${
                    currentPage === page
                      ? "bg-cyan-600 text-white hover:bg-cyan-700"
                      : "border-gray-800 bg-black/50 text-white hover:bg-gray-900"
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              )
            }

            // For large page counts, show ellipsis
            if (
              (totalPages > 5 && page === 2 && currentPage > 3) ||
              (totalPages > 5 && page === totalPages - 1 && currentPage < totalPages - 2)
            ) {
              return <span key={page}>...</span>
            }

            return null
          })}

          <Button
            variant="outline"
            size="icon"
            className="border-gray-800 bg-black/50 text-white hover:bg-gray-900"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Results count */}
      <div className="mt-4 text-center text-sm text-gray-400">
        {t("showing")} {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} {t("of")}{" "}
        {filteredProjects.length} {t("projects")}
      </div>
    </div>
  )
}
