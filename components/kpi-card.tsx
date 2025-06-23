import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description?: string
  color?: "blue" | "green" | "purple" | "orange"
}

export function KpiCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
  color = "blue",
}: KpiCardProps) {
  const colorStyles = {
    blue: "gradient-blue",
    green: "gradient-green",
    purple: "gradient-purple",
    orange: "gradient-orange",
  }

  return (
    <Card className="glass-card-dark border-white/10 hover-lift">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorStyles[color]} flex items-center justify-center`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p
              className={cn("text-sm flex items-center gap-1", {
                "text-green-400": changeType === "positive",
                "text-red-400": changeType === "negative",
                "text-gray-400": changeType === "neutral",
              })}
            >
              {change} {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
