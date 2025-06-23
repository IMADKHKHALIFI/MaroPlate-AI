import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  label: string
  value: number
  max: number
  unit?: string
  showValue?: boolean
  className?: string
}

export function ProgressBar({ label, value, max, unit = "", showValue = false, className }: ProgressBarProps) {
  const percentage = (value / max) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        {showValue && (
          <span className="font-medium">
            {value}
            {unit} / {max}
            {unit}
          </span>
        )}
      </div>
      <Progress value={percentage} className={cn("h-2", className)} />
    </div>
  )
}
