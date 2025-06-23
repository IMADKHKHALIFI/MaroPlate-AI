import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface HeaderProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  icon?: string
}

export function Header({ title, subtitle, children, icon }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9 hover:bg-white/10 text-white border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105" />
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {icon && <span className="text-2xl">{icon}</span>}
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center space-x-3">{children}</div>}
    </div>
  )
}
