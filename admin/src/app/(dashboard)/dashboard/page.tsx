"use client";

import { motion } from "framer-motion";
import { BarChart as BarChartIcon } from "lucide-react";

import { RevenueChart } from "@/components/revenue-chart";
import { VenueStatusChart } from "@/components/venue-status-chart";
import { SportTypeChart } from "@/components/sport-type-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { EmptyDashboard } from "@/components/empty-data";
import { useDashboard } from "@/queries/useDashboard";
export default function DashboardPage() {
  const { data: dashboard, isLoading } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (!dashboard) return <EmptyDashboard />;

  return (
    <div className=" space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <BarChartIcon className="w-10 h-10 text-primary" />
        <DashboardHeader heading="Trang chủ" text=" " />
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Thống kê tổng quan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VenueStatusChart dashboard={dashboard} />
            <SportTypeChart dashboard={dashboard} />
          </div>

          <div className="w-full">
            <RevenueChart dashboard={dashboard} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
