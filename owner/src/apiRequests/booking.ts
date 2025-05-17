import http from "@/utils/api";
import {BookingStatsData} from "@/types/booking";
import qs from 'query-string';

const bookingApiRequests = {
    sGetStats: (params?: { month?: string; year?: string }) => {
        const query = params ? `?${qs.stringify(params)}` : '';
        return http.get<IBackendRes<BookingStatsData>>(`bookings/owner/stats${query}`);
    }
}

export default bookingApiRequests;