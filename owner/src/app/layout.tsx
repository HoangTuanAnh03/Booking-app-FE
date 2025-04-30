import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import AppProvider from "@/components/app-provider"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AE Booking - Owner",
  description: "Manage your venues efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
        <Toaster position="top-right" />
        {children}
        </AppProvider>
      </body>
    </html>
  )
}
