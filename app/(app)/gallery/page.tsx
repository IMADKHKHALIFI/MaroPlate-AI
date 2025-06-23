"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FilterBar } from "@/components/filter-bar"
import { GalleryCard } from "@/components/gallery-card"
import { Button } from "@/components/ui/button"
import { Upload, Sparkles } from "lucide-react"
import { useGalleryStore } from "@/lib/store/gallery-store"

export default function GalleryPage() {
  const { items, toggleFavorite } = useGalleryStore()
  const [filteredItems, setFilteredItems] = useState(items)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Update filtered items when store items change
  useEffect(() => {
    setFilteredItems(items)
  }, [items])

  const handleFilterChange = (filters: any) => {
    let filtered = items

    if (filters.search) {
      filtered = filtered.filter(
        (item) =>
          item.plateNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    if (filters.model && filters.model !== "all") {
      filtered = filtered.filter((item) => item.modelName === filters.model)
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter((item) => item.isFavorite)
    }

    setFilteredItems(filtered)
  }

  const handleFavoriteToggle = (id: string) => {
    toggleFavorite(id)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Header title="Gallery & History" subtitle="Browse detection history and manage your image collection">
        <Button className="gradient-purple text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </Header>

      <FilterBar
        onFilterChange={handleFilterChange}
        showFavoritesOnly={showFavoritesOnly}
        onFavoritesToggle={setShowFavoritesOnly}
      />

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-400" />
          <span>{filteredItems.length} images au total</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>{filteredItems.filter((item) => item.isFavorite).length} favoris</span>
        </div>
        <div className="flex items-center gap-2">
          <span>•</span>
          <span>{filteredItems.filter((item) => !item.id.startsWith("mock-")).length} détections récentes</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <GalleryCard key={item.id} {...item} onFavoriteToggle={handleFavoriteToggle} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun élément ne correspond à vos filtres actuels.</p>
        </div>
      )}
    </div>
  )
}
