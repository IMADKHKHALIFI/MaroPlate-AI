import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, CheckCircle } from "lucide-react"
import Image from "next/image"

interface ImageResultCardProps {
  title: string
  image: string | null
  isProcessing?: boolean
  showBoundingBox?: boolean
  confidence?: number
}

export function ImageResultCard({
  title,
  image,
  isProcessing = false,
  showBoundingBox = false,
  confidence,
}: ImageResultCardProps) {
  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </div>
        {confidence && <Badge className="gradient-green text-white border-0">Score: {confidence}%</Badge>}
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
          {isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-gray-400">Traitement en cours...</p>
              </div>
            </div>
          ) : image ? (
            <>
              <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
              {showBoundingBox && (
                <div className="absolute inset-4 border-2 border-green-400 rounded shadow-lg">
                  <div className="absolute -top-6 left-0 bg-green-400 text-black px-2 py-1 rounded text-xs font-medium">
                    89.5%
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Aucune image sélectionnée</p>
            </div>
          )}
        </div>

        {image && !isProcessing && (
          <div className="flex justify-end mt-4">
            <Button className="gradient-green text-white border-0 hover-lift">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
