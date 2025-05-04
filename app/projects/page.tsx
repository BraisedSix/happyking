"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ProjectFilter from "@/components/project-filter"
import ProjectGrid from "@/components/project-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function ProjectsPage() {
  const { t } = useLanguage()
  const isMobile = useMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilters, setActiveFilters] = useState({
    category: "all",
    sortBy: "heat",
    timeframe: "all",
    verified: false,
  })

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string | boolean) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setCurrentPage(1) // Reset to first page on filter change
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t("allProjects")}</h1>
          <p className="text-gray-400">{t("discoverAndParticipate")}</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder={t("searchProjects")}
              value={searchQuery}
              onChange={handleSearchChange}
              className="border-gray-800 bg-black/50 pl-10"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-4 md:flex">
            <Button
              variant="outline"
              className="border-gray-800 bg-black/50 text-white hover:bg-gray-900"
              onClick={() => {
                const newSortBy = activeFilters.sortBy === "heat" ? "newest" : "heat"
                handleFilterChange("sortBy", newSortBy)
              }}
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              {activeFilters.sortBy === "heat" ? t("sortByHeat") : t("sortByNewest")}
            </Button>

            <ProjectFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile Filters */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-800 bg-black/50 text-white hover:bg-gray-900"
              onClick={() => {
                const newSortBy = activeFilters.sortBy === "heat" ? "newest" : "heat"
                handleFilterChange("sortBy", newSortBy)
              }}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-800 bg-black/50 text-white hover:bg-gray-900"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-gray-800 bg-gray-950 text-white">
                <div className="py-6">
                  <h3 className="mb-4 text-lg font-medium">{t("filters")}</h3>
                  <ProjectFilter activeFilters={activeFilters} onFilterChange={handleFilterChange} isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mb-6 flex flex-wrap gap-2">
          {activeFilters.category !== "all" && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-cyan-800/50 bg-cyan-900/10 text-xs text-cyan-400 hover:bg-cyan-900/20"
              onClick={() => handleFilterChange("category", "all")}
            >
              {t("category")}: {activeFilters.category} ×
            </Button>
          )}
          {activeFilters.timeframe !== "all" && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-purple-800/50 bg-purple-900/10 text-xs text-purple-400 hover:bg-purple-900/20"
              onClick={() => handleFilterChange("timeframe", "all")}
            >
              {t("timeframe")}: {activeFilters.timeframe} ×
            </Button>
          )}
          {activeFilters.verified && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-green-800/50 bg-green-900/10 text-xs text-green-400 hover:bg-green-900/20"
              onClick={() => handleFilterChange("verified", false)}
            >
              {t("verifiedOnly")} ×
            </Button>
          )}
        </div>

        {/* Projects Grid */}
        <ProjectGrid
          searchQuery={searchQuery}
          activeFilters={activeFilters}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </main>

      <Footer />
    </div>
  )
}
