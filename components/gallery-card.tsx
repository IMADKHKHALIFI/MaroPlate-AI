"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Star, Trash2, MapPin } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useDetectionStore } from "@/lib/store/detection-store"
import { useGalleryStore } from "@/lib/store/gallery-store"
import { useToast } from "@/hooks/use-toast"
import { plateAPI } from "@/lib/api/plate-api"

interface GalleryCardProps {
  id: string
  thumbnail: string
  plateNumber: string
  confidence: number
  datetime: string
  modelName: string
  tags: string[]
  status: string
  isFavorite: boolean
  originalImage?: string
  detectionImage?: string
  onFavoriteToggle: (id: string) => void
}

export function GalleryCard({
  id,
  thumbnail,
  plateNumber,
  confidence,
  datetime,
  modelName,
  tags,
  status,
  isFavorite,
  originalImage,
  detectionImage,
  onFavoriteToggle,
}: GalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const setImageForReanalysis = useDetectionStore((state) => state.setImageForReanalysis)
  const removeItem = useGalleryStore((state) => state.removeItem)

  // Extract region info from plate number
  const getRegionInfo = () => {
    const parsedPlate = plateAPI.parsePlateText(plateNumber)
    if (parsedPlate.regionCode) {
      return {
        code: parsedPlate.regionCode,
        name: parsedPlate.regionName,
      }
    }
    return null
  }

  const regionInfo = getRegionInfo()

  const handleReanalyze = () => {
    // Use original image if available, otherwise use thumbnail
    const imageToAnalyze = originalImage || detectionImage || thumbnail

    if (imageToAnalyze) {
      // Set the image in detection store for reanalysis
      setImageForReanalysis(imageToAnalyze, plateNumber)

      toast({
        title: "Redirection vers l'analyse",
        description: `Image de la plaque ${plateNumber} prête pour réanalyse`,
      })

      // Navigate to detection page
      router.push("/detection")
    } else {
      toast({
        title: "Erreur",
        description: "Image non disponible pour la réanalyse",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    // Simulate deletion delay for better UX
    setTimeout(() => {
      removeItem(id)
      toast({
        title: "Image supprimée",
        description: `L'analyse de la plaque ${plateNumber} a été supprimée`,
      })
      setIsDeleting(false)
    }, 500)
  }

  if (isDeleting) {
    return (
      <Card className="glass-card-dark border-white/10 overflow-hidden opacity-50 animate-pulse">
        <div className="aspect-video bg-gray-800 flex items-center justify-center">
          <p className="text-gray-400">Suppression...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      className="glass-card-dark border-white/10 overflow-hidden hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={`Detection ${id}`}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <Badge className="gradient-green text-white border-0 font-medium">{confidence}%</Badge>
        </div>

        {/* Action buttons that appear on hover */}
        <div
          className={cn("absolute top-3 left-3 flex gap-2 transition-opacity", isHovered ? "opacity-100" : "opacity-0")}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40"
            onClick={() => onFavoriteToggle(id)}
          >
            <Star className={cn("h-4 w-4", isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white")} />
          </Button>

          {/* Delete button - always available */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-black/20 hover:bg-red-500/40"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <div className="font-mono text-lg font-bold text-white mb-1">{plateNumber}</div>
          <div className="text-sm text-gray-400">{datetime}</div>
        </div>

        {/* Region Information */}
        {regionInfo && (
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <MapPin className="h-4 w-4 text-purple-400" />
            <div className="text-center">
              <p className="text-xs text-purple-400 font-medium">{regionInfo.name}</p>
              <p className="text-xs text-gray-400">Code: {regionInfo.code}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
            {modelName}
          </Badge>
          <span className="text-xs text-gray-400">{status}</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-2 py-0 border-purple-400 text-purple-400">
              {tag}
            </Badge>
          ))}
        </div>

        <Button onClick={handleReanalyze} className="w-full gradient-blue text-white border-0 hover-lift">
          <RotateCcw className="h-4 w-4 mr-2" />
          Analyser à nouveau
        </Button>
      </CardContent>
    </Card>
  )
}
