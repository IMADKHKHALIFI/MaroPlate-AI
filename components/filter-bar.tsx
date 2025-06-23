"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star } from "lucide-react"

interface FilterBarProps {
  onFilterChange: (filters: {
    search: string
    model: string
    dateSort: string
  }) => void
  showFavoritesOnly: boolean
  onFavoritesToggle: (show: boolean) => void
}

export function FilterBar({ onFilterChange, showFavoritesOnly, onFavoritesToggle }: FilterBarProps) {
  const [filters, setFilters] = useState({
    search: "",
    model: "all",
    dateSort: "newest",
  })

  const handleFilterUpdate = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 glass-card-dark rounded-2xl">
      <div className="flex-1 min-w-[300px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par plaque ou tag..."
            value={filters.search}
            onChange={(e) => handleFilterUpdate("search", e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <Select value={filters.model} onValueChange={(value) => handleFilterUpdate("model", value)}>
        <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
          <SelectValue placeholder="Tous les modèles" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="all">Tous les modèles</SelectItem>
          <SelectItem value="best">best</SelectItem>
          <SelectItem value="license_plate_detector">license_plate_detector</SelectItem>
          <SelectItem value="LP detection">LP detection</SelectItem>
          <SelectItem value="yolov8n">yolov8n</SelectItem>
          <SelectItem value="yolov3">yolov3</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.dateSort} onValueChange={(value) => handleFilterUpdate("dateSort", value)}>
        <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="newest">Date</SelectItem>
          <SelectItem value="oldest">Plus ancien</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={showFavoritesOnly ? "default" : "outline"}
        onClick={() => onFavoritesToggle(!showFavoritesOnly)}
        className={
          showFavoritesOnly
            ? "gradient-blue text-white border-0"
            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
        }
      >
        <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? "fill-current" : ""}`} />
        Favoris
      </Button>
    </div>
  )
}
