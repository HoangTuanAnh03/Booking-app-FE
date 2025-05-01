"use client";

import { usePathname } from "next/navigation";
import { Calendar, Home, Landmark, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Trang chủ",
    url: "/dashboard",
    icon: Home,
  },
  
  {
    title: "Quản lý người dùng",
    url: "/users",
    icon: Users,
  },
{
    title: "Quản lý sân",
    url: "/venues",
    icon: Landmark,
  },
  {
    title: "Quản lý thể loại sân",
    url: "/sporttype",
    icon: Landmark,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="h-screen border-r bg-white">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-gray-700 mb-4">
            Quản trị hệ thống
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname.startsWith(item.url);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 hover:bg-gray-100 hover:text-black"
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
