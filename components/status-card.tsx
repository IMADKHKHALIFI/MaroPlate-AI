import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackendStatus } from "@/components/backend-status"
import { Sparkles } from "lucide-react"

export function StatusCard() {
  return (
    <div className="space-y-4">
      <Card className="glass-card-dark border-purple-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-green-400" />
            <CardTitle className="text-sm text-white">Statut AI</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Modèles actifs</span>
            <Badge className="gradient-green text-white text-xs">2/2</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Précision moy.</span>
            <span className="text-xs text-blue-400 font-medium">94.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Statut système</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-green-400">Optimal</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <BackendStatus />
    </div>
  )
}
