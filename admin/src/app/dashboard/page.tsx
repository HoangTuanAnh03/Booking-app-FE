"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart as BarChartIcon } from "lucide-react";

import { dashboardRequest } from "@/app/apiRequest/dashboard";
import { DashboardResType } from "@/schemaValidations/dashboard.schema";

import { Skeleton } from "@/components/ui/skeleton";
import { RevenueChart } from "@/components/RevenueChart";
import { VenueStatusChart } from "@/components/VenueStatusChart";
import { SportTypeChart } from "@/components/SportTypeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResType["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const dashboards = {
    totalRevenue: {
      "2023-01": 1000000,
      "2023-02": 1500000,
      "2023-03": 2000000,
      "2023-04": 1800000,
      "2023-05": 2200000,
      "2023-06": 2500000,
      "2023-07": 3000000,
      "2023-08": 2800000,
      "2023-09": 2700000,
      "2023-10": 3200000,
      "2023-11": 3100000,
      "2023-12": 3500000,
      "2024-01": 1200000,
      "2024-02": 1600000,
      "2024-03": 1900000,
      "2024-04": 2100000,
    },
  };
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { payload } = await dashboardRequest.getDashboardData();
        setDashboard(payload.data);
        console.log("Dashboard data fetched successfully:", payload.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (!dashboard) return <EmptyDashboard />;

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3"
      >
        <BarChartIcon className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Trang chủ</h1>
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
            <RevenueChart dashboard={dashboards} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="flex items-center justify-center h-[60vh] text-muted-foreground text-xl">
      Không có dữ liệu để hiển thị.
    </div>
  );
}
