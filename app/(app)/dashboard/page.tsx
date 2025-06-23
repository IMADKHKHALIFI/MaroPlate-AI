"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { StatusBadge } from "@/components/status-badge"
import { KpiCard } from "@/components/kpi-card"
import { PerformanceSection } from "@/components/performance-section"
import { RecentDetections } from "@/components/recent-detections"
import { Camera, Target, Zap, TrendingUp } from 'lucide-react'
import { plateAPI, DashboardStats } from "@/lib/api/plate-api"
import { useGalleryStore } from "@/lib/store/gallery-store"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { items } = useGalleryStore()
  // Calculate actual gallery statistics (exclude mock data)
  const totalDetections = items.filter((item) => !item.id.startsWith("mock-")).length
  const recentDetections = items.filter((item) => !item.id.startsWith("mock-")).length
  const averageConfidence = items.length > 0 
    ? Math.round((items.reduce((sum, item) => sum + item.confidence, 0) / items.length) * 10) / 10
    : 0
  
  // Calculate success rate based on gallery items with status "Analysé"
  const successfulDetections = items.filter((item) => item.status === "Analysé").length
  const successRate = items.length > 0 
    ? Math.round((successfulDetections / items.length) * 100 * 10) / 10
    : 100
  
  // Calculate average processing time
  const itemsWithProcessingTime = items.filter((item) => item.processingTime !== undefined)
  const averageProcessingTime = itemsWithProcessingTime.length > 0
    ? Math.round((itemsWithProcessingTime.reduce((sum, item) => sum + (item.processingTime || 0), 0) / itemsWithProcessingTime.length) * 100) / 100
    : 1.0

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await plateAPI.fetchDashboardStats()
        setStats(dashboardStats)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <Header 
        title="Laboratoire de Vision IA" 
        subtitle="Système avancé de détection de plaques d'immatriculation marocaines"
        icon="🔬"
      >
        <div className="flex gap-3">
          <StatusBadge status="operational" text="Tous systèmes opérationnels" />
          <StatusBadge status="active" text="5 modèles actifs" />
          <StatusBadge status="optimal" text="Performance optimale" />
        </div>
      </Header>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Détections Totales"
          value={totalDetections.toString()}
          change={recentDetections > 0 ? `+${recentDetections} nouvelles` : "Aucune nouvelle"}
          changeType={recentDetections > 0 ? "positive" : "neutral"}
          icon={Camera}
          description="images dans la galerie"
          color="blue"
        />
        <KpiCard
          title="Précision Moyenne"
          value={`${averageConfidence}%`}
          change={loading ? "..." : stats?.averageAccuracy.change || "+0%"}
          changeType={stats?.averageAccuracy.changeType || "neutral"}
          icon={Target}
          description="vs hier"
          color="green"
        />
        <KpiCard
          title="Temps Moyen"
          value={`${averageProcessingTime}s`}
          change={averageProcessingTime < 1.5 ? "Rapide" : averageProcessingTime < 3 ? "Normal" : "Lent"}
          changeType={averageProcessingTime < 1.5 ? "positive" : averageProcessingTime < 3 ? "neutral" : "negative"}
          icon={Zap}
          description="par détection"
          color="purple"
        />
        <KpiCard
          title="Taux de Succès"
          value={`${successRate}%`}
          change={successRate === 100 ? "Parfait!" : successRate > 90 ? "Excellent" : "En amélioration"}
          changeType={successRate >= 95 ? "positive" : successRate >= 80 ? "neutral" : "negative"}
          icon={TrendingUp}
          description="détections réussies"
          color="orange"
        />
      </div>

      {/* Performance and Recent Detections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PerformanceSection />
        <RecentDetections />
      </div>
    </div>
  )
}
