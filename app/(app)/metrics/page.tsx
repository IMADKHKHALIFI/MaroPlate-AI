"use client"

import { Header } from "@/components/header"
import { MetricsChart } from "@/components/metrics-chart"
import { ConfusionMatrixGrid } from "@/components/confusion-matrix-grid"
import { PerformanceTable } from "@/components/performance-table"
import { KpiCard } from "@/components/kpi-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Award, Activity, Target, Gauge } from "lucide-react"

export default function MetricsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <Header title="Metrics & Comparisons" subtitle="Comprehensive performance analysis and model comparisons">
        <div className="flex gap-2">
          <Select defaultValue="f1">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="f1">F1 Score</SelectItem>
              <SelectItem value="precision">Precision</SelectItem>
              <SelectItem value="recall">Recall</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Header>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title="Best Model"
          value="YOLOv8"
          change="96.8% F1"
          changeType="neutral"
          icon={Award}
          description="Current leader"
        />
        <KpiCard
          title="Active Models"
          value="5"
          change="All running"
          changeType="positive"
          icon={Activity}
          description="Operational"
        />
        <KpiCard
          title="Avg. F1 Score"
          value="94.2%"
          change="+1.5%"
          changeType="positive"
          icon={Target}
          description="vs. last week"
        />
        <KpiCard
          title="Max Throughput"
          value="150 it/s"
          change="YOLOv5"
          changeType="neutral"
          icon={Gauge}
          description="Peak performance"
        />
        <KpiCard
          title="Samples Tested"
          value="50,000"
          change="This month"
          changeType="neutral"
          icon={Target}
          description="Total processed"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MetricsChart
          title="Model Comparison (F1 Score)"
          type="bar"
          data={[
            { name: "YOLOv8", value: 96.8, speed: "45 it/s" },
            { name: "YOLOv5", value: 94.2, speed: "150 it/s" },
            { name: "RetinaNet", value: 92.1, speed: "30 it/s" },
            { name: "SSD", value: 89.5, speed: "120 it/s" },
            { name: "Faster R-CNN", value: 91.3, speed: "25 it/s" },
          ]}
        />
        <MetricsChart
          title="Throughput Comparison"
          type="bar"
          data={[
            { name: "YOLOv5", value: 150, metric: "it/s" },
            { name: "SSD", value: 120, metric: "it/s" },
            { name: "YOLOv8", value: 45, metric: "it/s" },
            { name: "RetinaNet", value: 30, metric: "it/s" },
            { name: "Faster R-CNN", value: 25, metric: "it/s" },
          ]}
        />
      </div>

      {/* Confusion Matrices */}
      <ConfusionMatrixGrid />

      {/* Detailed Metrics */}
      <Tabs defaultValue="precision" className="space-y-4">
        <TabsList>
          <TabsTrigger value="precision">Precision</TabsTrigger>
          <TabsTrigger value="recall">Recall</TabsTrigger>
          <TabsTrigger value="f1">F1 Score</TabsTrigger>
        </TabsList>
        <TabsContent value="precision" className="space-y-4">
          <MetricsChart
            title="Precision by Model"
            type="bar"
            data={[
              { name: "YOLOv8", value: 97.2 },
              { name: "Faster R-CNN", value: 95.8 },
              { name: "YOLOv5", value: 94.1 },
              { name: "RetinaNet", value: 93.5 },
              { name: "SSD", value: 91.2 },
            ]}
          />
        </TabsContent>
        <TabsContent value="recall" className="space-y-4">
          <MetricsChart
            title="Recall by Model"
            type="bar"
            data={[
              { name: "YOLOv8", value: 96.4 },
              { name: "YOLOv5", value: 94.3 },
              { name: "RetinaNet", value: 90.8 },
              { name: "Faster R-CNN", value: 87.2 },
              { name: "SSD", value: 87.9 },
            ]}
          />
        </TabsContent>
        <TabsContent value="f1" className="space-y-4">
          <MetricsChart
            title="F1 Score by Model"
            type="bar"
            data={[
              { name: "YOLOv8", value: 96.8 },
              { name: "YOLOv5", value: 94.2 },
              { name: "RetinaNet", value: 92.1 },
              { name: "Faster R-CNN", value: 91.3 },
              { name: "SSD", value: 89.5 },
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Performance Table */}
      <PerformanceTable />
    </div>
  )
}
