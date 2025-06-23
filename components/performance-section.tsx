import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"

export function PerformanceSection() {
  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-400" />
          <CardTitle className="text-white">Performance en Temps Réel</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Modèles Actifs</span>
            <span className="text-green-400 font-medium">5/5</span>
          </div>
          <Progress value={100} className="h-2 bg-gray-700">
            <div className="h-full progress-green rounded-full transition-all duration-300" style={{ width: "100%" }} />
          </Progress>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">File d'Attente</span>
            <span className="text-blue-400 font-medium">2 tâches</span>
          </div>
          <Progress value={20} className="h-2 bg-gray-700">
            <div className="h-full progress-blue rounded-full transition-all duration-300" style={{ width: "20%" }} />
          </Progress>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Temps de Réponse</span>
            <span className="text-purple-400 font-medium">1.4s</span>
          </div>
          <Progress value={28} className="h-2 bg-gray-700">
            <div className="h-full progress-purple rounded-full transition-all duration-300" style={{ width: "28%" }} />
          </Progress>
        </div>
      </CardContent>
    </Card>
  )
}
