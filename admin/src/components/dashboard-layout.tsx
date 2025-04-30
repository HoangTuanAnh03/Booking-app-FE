"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BarChart3, Home, LayoutDashboard, Loader2, LogOut, Menu, PlusCircle, Settings, Trophy, Users } from "lucide-react"
import authApiRequest from "@/apiRequests/auth"

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: React.ReactNode
    variant: "default" | "ghost"
    href: string
  }[]
}

const logout = () => {
  authApiRequest.logout();
};
export function Nav({ links, isCollapsed }: NavProps) {
  const pathname = usePathname()

  return (
    <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent text-accent-foreground" : "transparent",
              isCollapsed && "justify-center",
            )}
          >
            {link.icon}
            {!isCollapsed && <span>{link.title}</span>}
            {!isCollapsed && link.label && <span className="ml-auto text-xs">{link.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Trophy className="h-6 w-6" />
                <span>Quản Lý Thể Thao</span>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
        <div className="w-full flex justify-between items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Trophy className="h-6 w-6" />
            <span className="hidden md:inline-block">AE booking - Admin</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="w-full hover:bg-primary hover:text-white transition-colors"
              size="sm"
              onClick={logout}
            >
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className={cn("hidden border-r bg-background md:block", isCollapsed ? "w-[70px]" : "w-[240px]")}>
          <div className="flex h-[calc(100vh-64px)] flex-col gap-4">
            <div className="mt-auto p-4">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? (
                  <LayoutDashboard className="h-4 w-4 rotate-0 transition-all" />
                ) : (
                  <LayoutDashboard className="h-4 w-4 rotate-90 transition-all" />
                )}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
