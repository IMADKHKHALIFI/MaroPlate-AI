import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const confusionMatrices = [
  {
    model: "best",
    matrix: { tp: 25, fp: 2, tn: 3, fn: 0 },
    precision: "83.3%",
  },
  {
    model: "license_plate_detector",
    matrix: { tp: 22, fp: 5, tn: 2, fn: 1 },
    precision: "76.7%",
  },
  {
    model: "LP detection",
    matrix: { tp: 23, fp: 1, tn: 4, fn: 2 },
    precision: "83.3%",
  },
  {
    model: "yolov8n",
    matrix: { tp: 0, fp: 15, tn: 15, fn: 0 },
    precision: "0.0%",
  },
  {
    model: "yolov3",
    matrix: { tp: 18, fp: 7, tn: 5, fn: 0 },
    precision: "60.0%",
  },
]

export function ConfusionMatrixGrid() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white flex items-center gap-2">🎯 Matrices de Confusion</h3>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {confusionMatrices.map((item) => (
          <Card key={item.model} className="glass-card-dark border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white">{item.model}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-1 text-xs mb-3">
                <div className="bg-green-500/20 p-2 rounded text-center border border-green-500/30">
                  <div className="font-bold text-green-400">{item.matrix.tp}</div>
                </div>
                <div className="bg-red-500/20 p-2 rounded text-center border border-red-500/30">
                  <div className="font-bold text-red-400">{item.matrix.fp}</div>
                </div>
                <div className="bg-red-500/20 p-2 rounded text-center border border-red-500/30">
                  <div className="font-bold text-red-400">{item.matrix.fn}</div>
                </div>
                <div className="bg-green-500/20 p-2 rounded text-center border border-green-500/30">
                  <div className="font-bold text-green-400">{item.matrix.tn}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Précision: {item.precision}</div>
              </div>
              <div className="flex justify-center mt-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded"></div>
                  <span className="text-gray-400">Vrais Positifs/Négatifs</span>
                </div>
              </div>
              <div className="flex justify-center mt-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded"></div>
                  <span className="text-gray-400">Faux Positifs/Négatifs</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
