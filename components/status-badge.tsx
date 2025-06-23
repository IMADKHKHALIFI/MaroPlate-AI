import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "operational" | "active" | "optimal" | "warning" | "error"
  text: string
  className?: string
}

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const statusStyles = {
    operational: "gradient-green text-white border-0",
    active: "gradient-blue text-white border-0",
    optimal: "gradient-purple text-white border-0",
    warning: "gradient-orange text-white border-0",
    error: "gradient-red text-white border-0",
  }

  return (
    <Badge className={cn(statusStyles[status], "px-4 py-2 rounded-full font-medium", className)}>
      <div className={cn("w-2 h-2 rounded-full mr-2 bg-white/80")} />
      {text}
    </Badge>
  )
}
