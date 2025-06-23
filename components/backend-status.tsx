"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { plateAPI } from "@/lib/api/plate-api"
import { Server, Wifi, WifiOff } from "lucide-react"

export function BackendStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await plateAPI.healthCheck()
        setIsConnected(true)
      } catch (error) {
        setIsConnected(false)
      } finally {
        setLoading(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-blue-400" />
          <CardTitle className="text-sm text-white">Backend Flask</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Statut</span>
          {loading ? (
            <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Vérification...</Badge>
          ) : (
            <Badge className={isConnected ? "gradient-green text-white border-0" : "gradient-red text-white border-0"}>
              <div className="flex items-center gap-1">
                {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isConnected ? "Connecté" : "Déconnecté"}
              </div>
            </Badge>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">API URL</span>
          <span className="text-xs text-blue-400 font-medium">
            {process.env.NEXT_PUBLIC_API_URL || "localhost:5000"}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Modèles</span>
          <span className="text-xs text-green-400 font-medium">{isConnected ? "YOLOv3 Chargé" : "Non disponible"}</span>
        </div>
      </CardContent>
    </Card>
  )
}
