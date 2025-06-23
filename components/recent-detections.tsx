"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGalleryStore } from "@/lib/store/gallery-store"

export function RecentDetections() {
  const { items } = useGalleryStore()

  // Get the 4 most recent detections
  const recentDetections = items.slice(0, 4).map((item) => ({
    id: item.id,
    plateNumber: item.plateNumber,
    confidence: item.confidence,
    timestamp: item.datetime,
    status: item.confidence > 95 ? "success" : item.confidence > 85 ? "warning" : "error",
  }))

  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-400" />
          <CardTitle className="text-white">Détections Récentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentDetections.length > 0 ? (
            recentDetections.map((detection) => (
              <div
                key={detection.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={cn("w-2 h-2 rounded-full", {
                      "bg-green-400": detection.status === "success",
                      "bg-yellow-400": detection.status === "warning",
                      "bg-red-400": detection.status === "error",
                    })}
                  />
                  <div>
                    <p className="font-medium text-sm text-white">{detection.plateNumber}</p>
                    <p className="text-xs text-gray-400">{detection.timestamp}</p>
                  </div>
                </div>
                <Badge className="gradient-green text-white border-0">{detection.confidence}% confiance</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 text-sm">Aucune détection récente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
