import type React from "react"
import "@/app/globals.css"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import AppProvider from "@/components/app-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/app_sidebar";
import { AppSidebar } from "@/components/app_sidebar";

const inter = Inter({ subsets: ["vietnamese"] })

export const metadata = {
  title: "AE Booking - Admin",
  description: "Quản lý loại thể thao",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            {/* <Header /> */}
            <Toaster />
            <main className="flex-1">{children}</main>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
