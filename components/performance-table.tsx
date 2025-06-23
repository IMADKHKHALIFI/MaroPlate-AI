"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const performanceData = [
  {
    model: "best",
    precision: 89.5,
    recall: 51.5,
    f1: 65.4,
    speed: 10.88,
    status: "Optimal",
  },
  {
    model: "license_plate_detector",
    precision: 73.0,
    recall: 81.8,
    f1: 77.1,
    speed: 15.36,
    status: "Optimal",
  },
  {
    model: "LP detection",
    precision: 96.2,
    recall: 75.8,
    f1: 84.7,
    speed: 18.24,
    status: "Optimal",
  },
  {
    model: "yolov8n",
    precision: 0.0,
    recall: 0.0,
    f1: 0.0,
    speed: 16.84,
    status: "Défaillant",
  },
  {
    model: "yolov3",
    precision: 65.5,
    recall: 59.4,
    f1: 62.3,
    speed: 1.08,
    status: "Optimal",
  },
]

export function PerformanceTable() {
  return (
    <Card className="glass-card-dark border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">📊 Matrice de Performance Complète</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="text-gray-300">Modèle</TableHead>
              <TableHead className="text-gray-300">Précision</TableHead>
              <TableHead className="text-gray-300">Rappel</TableHead>
              <TableHead className="text-gray-300">Score F1</TableHead>
              <TableHead className="text-gray-300">Vitesse</TableHead>
              <TableHead className="text-gray-300">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performanceData.map((row) => (
              <TableRow key={row.model} className="border-white/10">
                <TableCell className="font-medium text-white">{row.model}</TableCell>
                <TableCell className="text-blue-400">{row.precision}%</TableCell>
                <TableCell className="text-purple-400">{row.recall}%</TableCell>
                <TableCell className="font-bold text-green-400">{row.f1}%</TableCell>
                <TableCell className="text-orange-400">{row.speed} it/s</TableCell>
                <TableCell>
                  <Badge
                    className={
                      row.status === "Optimal"
                        ? "gradient-green text-white border-0"
                        : "gradient-red text-white border-0"
                    }
                  >
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
