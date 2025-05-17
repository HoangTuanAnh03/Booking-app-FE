import qs from "query-string";
import http from "@/utils/api";
import {BookingStatsData} from "@/types/booking";
import {DashboardData} from "@/types/dashboard";

const dashboardApiRequests = {
    sGetDashboard: () => {
        return http.get<IBackendRes<DashboardData>>(`/owner/dashboard`);
    }
}

export default dashboardApiRequests;