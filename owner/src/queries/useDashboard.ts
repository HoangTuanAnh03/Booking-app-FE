import {useQuery} from "@tanstack/react-query";
import dashboardApiRequests from "@/apiRequests/dashboard";

export const useDashboard = () => {
    return useQuery({
        queryKey: ["dashboard"],
        queryFn: () => dashboardApiRequests.sGetDashboard(),
        staleTime: 10 * 1000,
    });
};