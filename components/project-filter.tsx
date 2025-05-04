"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Filter, Check } from "lucide-react"

interface ProjectFilterProps {
  activeFilters: {
    category: string
    sortBy: string
    timeframe: string
    verified: boolean
  }
  onFilterChange: (filterType: string, value: string | boolean) => void
  isMobile?: boolean
}

export default function ProjectFilter({ activeFilters, onFilterChange, isMobile = false }: ProjectFilterProps) {
  const { t } = useLanguage()

  const categories = [
    { value: "all", label: t("allCategories") },
    { value: "defi", label: "DeFi" },
    { value: "nft", label: "NFT" },
    { value: "dao", label: "DAO" },
    { value: "gamefi", label: "GameFi" },
    { value: "metaverse", label: "Metaverse" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "exchange", label: "Exchange" },
    { value: "social", label: "Social" },
    { value: "privacy", label: "Privacy" },
    { value: "ai", label: "AI" },
  ]

  const timeframes = [
    { value: "all", label: t("allTime") },
    { value: "today", label: t("today") },
    { value: "week", label: t("thisWeek") },
    { value: "month", label: t("thisMonth") },
  ]

  // For mobile view, render as a full panel
  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium">{t("category")}</h4>
          <RadioGroup
            value={activeFilters.category}
            onValueChange={(value) => onFilterChange("category", value)}
            className="space-y-2"
          >
            {categories.map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <RadioGroupItem value={category.value} id={`category-${category.value}`} />
                <Label htmlFor={`category-${category.value}`}>{category.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">{t("timeframe")}</h4>
          <RadioGroup
            value={activeFilters.timeframe}
            onValueChange={(value) => onFilterChange("timeframe", value)}
            className="space-y-2"
          >
            {timeframes.map((timeframe) => (
              <div key={timeframe.value} className="flex items-center space-x-2">
                <RadioGroupItem value={timeframe.value} id={`timeframe-${timeframe.value}`} />
                <Label htmlFor={`timeframe-${timeframe.value}`}>{timeframe.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified-mobile"
            checked={activeFilters.verified}
            onCheckedChange={(checked) => onFilterChange("verified", checked === true)}
          />
          <Label htmlFor="verified-mobile">{t("verifiedOnly")}</Label>
        </div>
      </div>
    )
  }

  // For desktop view, render as a dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-gray-800 bg-black/50 text-white hover:bg-gray-900">
          <Filter className="mr-2 h-4 w-4" />
          {t("filters")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border-gray-800 bg-gray-950 text-white">
        <DropdownMenuLabel>{t("category")}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.value}
              className={`flex cursor-pointer items-center justify-between ${
                activeFilters.category === category.value ? "bg-gray-900" : ""
              }`}
              onClick={() => onFilterChange("category", category.value)}
            >
              {category.label}
              {activeFilters.category === category.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-800" />

        <DropdownMenuLabel>{t("timeframe")}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {timeframes.map((timeframe) => (
            <DropdownMenuItem
              key={timeframe.value}
              className={`flex cursor-pointer items-center justify-between ${
                activeFilters.timeframe === timeframe.value ? "bg-gray-900" : ""
              }`}
              onClick={() => onFilterChange("timeframe", timeframe.value)}
            >
              {timeframe.label}
              {activeFilters.timeframe === timeframe.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-800" />

        <div className="flex items-center px-2 py-2">
          <Checkbox
            id="verified"
            checked={activeFilters.verified}
            onCheckedChange={(checked) => onFilterChange("verified", checked === true)}
            className="mr-2"
          />
          <Label htmlFor="verified">{t("verifiedOnly")}</Label>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
