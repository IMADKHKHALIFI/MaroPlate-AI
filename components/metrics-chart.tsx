"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricsChartProps {
  title: string
  type: "bar"
  data: Array<{
    name: string
    value: number
    speed?: string
    metric?: string
  }>
}

export function MetricsChart({ title, data }: MetricsChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">{item.name}</span>
                <span className="text-sm font-medium text-white">
                  {item.value}% {item.speed && `(${item.speed})`}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === 0
                      ? "progress-green"
                      : index === 1
                        ? "progress-blue"
                        : index === 2
                          ? "progress-purple"
                          : index === 3
                            ? "progress-orange"
                            : "bg-gray-500"
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
