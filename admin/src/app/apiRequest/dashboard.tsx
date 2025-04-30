import { DashboardResType } from "@/schemaValidations/dashboard.schema";
import http from "@/utils/api";

export const dashboardRequest = {
  getDashboardData: () => http.get<DashboardResType>("admin/dashboard"),
};
