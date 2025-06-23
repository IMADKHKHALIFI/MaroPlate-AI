"use client"
import { BarChart3, Camera, Home, ImageIcon, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { StatusCard } from "@/components/status-card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const mainItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Détection AI",
    url: "/detection",
    icon: Camera,
    badge: "LIVE",
  },
  {
    title: "Métriques",
    url: "/metrics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Galerie",
    url: "/gallery",
    icon: ImageIcon,
    badge: "12",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r-0 bg-transparent group">
      <div className="glass-card-dark h-full relative overflow-hidden flex flex-col">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-orb floating-orb-1"></div>
          <div className="floating-orb floating-orb-2"></div>
          <div className="floating-orb floating-orb-3"></div>
        </div>

        <SidebarHeader className="p-4 relative z-10 flex-shrink-0">
          <div className="flex items-center gap-3 animate-slide-in">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-purple pulse-glow">
              <Zap className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div className="animate-fade-in-delay">
              <h1 className="text-xl font-bold text-white">PlateAI</h1>
              <p className="text-xs text-gray-400">Détection Marocaine</p>
            </div>
          </div>

          {/* Compact System Status */}
          <div className="mt-3 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 animate-fade-in-delay-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400 font-medium">Système Opérationnel</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs text-green-400">99.9%</span>
              </div>
            </div>
            <Progress value={99.9} className="h-1 bg-gray-700 mt-1">
              <div
                className="h-full progress-green rounded-full transition-all duration-1000"
                style={{ width: "99.9%" }}
              />
            </Progress>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4 relative z-10 flex-1">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {mainItems.map((item, index) => (
                  <SidebarMenuItem
                    key={item.title}
                    className="animate-slide-in-stagger"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className={`
                        h-12 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-lg
                        ${
                          pathname === item.url
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                            : "text-gray-300 hover:text-white"
                        }
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 w-full">
                        <div
                          className={`p-1.5 rounded-lg transition-all duration-300 ${
                            pathname === item.url ? "bg-white/20" : "bg-white/5"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm truncate">{item.title}</span>
                            {item.badge && (
                              <Badge
                                className={`text-xs px-1.5 py-0 ${
                                  item.badge === "LIVE"
                                    ? "gradient-red text-white animate-pulse"
                                    : "gradient-blue text-white"
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Recent Activity - Minimal */}
          <SidebarGroup className="mt-6">
            <div className="px-2 mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Activité Récente</h3>
            </div>
            <SidebarGroupContent>
              <div className="space-y-1">
                {[
                  { text: "Plaque 123456 détectée", type: "success" },
                  { text: "Modèle YOLOv3 mis à jour", type: "info" },
                  { text: "Nouvelle image analysée", type: "success" },
                  { text: "Système redémarré", type: "warning" },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 animate-slide-in-stagger"
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-400"
                          : activity.type === "warning"
                            ? "bg-yellow-400"
                            : "bg-blue-400"
                      } animate-pulse`}
                    ></div>
                    <p className="text-xs text-white truncate flex-1">{activity.text}</p>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 relative z-10 flex-shrink-0">
          <div className="animate-fade-in-delay-3">
            <StatusCard />
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
