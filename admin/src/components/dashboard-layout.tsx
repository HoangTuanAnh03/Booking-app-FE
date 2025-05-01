"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  LogOut,
  Menu,
  MapPin,
  Tag
} from "lucide-react"
import authApiRequest from "@/apiRequests/auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NavItemProps {
  icon: React.ElementType
  title: string
  href: string
  isCollapsed: boolean
}

function NavItem({ icon: Icon, title, href, isCollapsed }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname.startsWith(href)

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
              isCollapsed ? "justify-center" : "justify-start",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {!isCollapsed && <span>{title}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{title}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}

const navItems = [
  { icon: LayoutDashboard, title: "Trang chủ", href: "/dashboard" },
  { icon: BarChart3, title: "Quản lý người dùng", href: "/users" },
  { icon: MapPin, title: "Quản lý sân", href: "/venues" },
  { icon: Tag, title: "Quản lý thể loại sân", href: "/sporttype" },
]

const logout = () => {
  authApiRequest.logout()
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 md:hidden">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Trophy className="h-6 w-6" />
                <span>Quản Lý Thể Thao</span>
              </Link>
            </div>
            <nav className="mt-4 space-y-2">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  icon={item.icon}
                  title={item.title}
                  href={item.href}
                  isCollapsed={false}
                />
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo & Logout */}
        <div className="w-full h-10 flex justify-between items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Trophy className="h-6 w-6" />
            <span className="hidden md:inline-block">AE booking - Admin</span>
          </Link>
          <Button
            variant="outline"
            className="hover:bg-primary hover:text-white transition-colors"
            size="sm"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside
          className={cn(
            "fixed left-0 top-16 z-30 hidden md:flex h-[calc(100vh-64px)] flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed ? "w-[70px]" : "w-[240px]"
          )}
        >
          <div className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                title={item.title}
                href={item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
          <div className="mt-auto border-t p-4 flex justify-end">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <LayoutDashboard
                className={cn("h-4 w-4 transition-all", isCollapsed ? "rotate-0" : "rotate-90")}
              />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        </aside>

        {/* Page Content */}
        <main
          className={cn(
            "flex-1 p-6 md:p-8 pt-24 transition-all",
            isCollapsed ? "md:ml-[70px]" : "md:ml-[240px]"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
