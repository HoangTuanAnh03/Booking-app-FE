// queries/dashboard.ts
import { getDashboardData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["dashboard"] as const,
};

export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: async () => {
      const res = await getDashboardData();
      return res.payload.data; 
    },
  });
};
