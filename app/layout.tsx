import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { SettingsDialog } from "@/components/settings-dialog"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Film Tracker",
  description: "Track your analog film development process",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
            <Navigation />
            <div className="absolute right-4 top-4">
              <SettingsDialog />
            </div>
          </div>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
        <Sonner />
        <Analytics />
      </body>
    </html>
  )
}
