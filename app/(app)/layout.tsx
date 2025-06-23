import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FloatingChatBot } from "@/components/floating-chat-bot"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="starfield-bg min-h-screen relative">
      {/* Floating particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Meteor shower */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
        <div className="meteor"></div>
      </div>

      {/* Body floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="body-floating-orb body-floating-orb-1"></div>
        <div className="body-floating-orb body-floating-orb-2"></div>
        <div className="body-floating-orb body-floating-orb-3"></div>
        <div className="body-floating-orb body-floating-orb-4"></div>
        <div className="body-floating-orb body-floating-orb-5"></div>
      </div>

      {/* Pulsing dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pulsing-dot pulsing-dot-1"></div>
        <div className="pulsing-dot pulsing-dot-2"></div>
        <div className="pulsing-dot pulsing-dot-3"></div>
        <div className="pulsing-dot pulsing-dot-4"></div>
      </div>

      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto relative z-10">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Floating Chat Bot */}
      <FloatingChatBot />
    </div>
  )
}
