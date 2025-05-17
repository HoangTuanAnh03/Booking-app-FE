import {useQuery} from "@tanstack/react-query";
import bookingApiRequests from "@/apiRequests/booking";

export const useBookingStats = (params?: { month?: string; year?: string }) => {
    return useQuery({
        queryKey: ["bookingStats", params],
        queryFn: () => bookingApiRequests.sGetStats(params),
        staleTime: 10 * 1000,
    });
};