import type React from "react";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";
import {DashboardSidebar} from "@/components/venue-sidebar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider className="z-20">
            <DashboardSidebar />
            <SidebarInset className="bg-background">{children}</SidebarInset>
        </SidebarProvider>
    )
}