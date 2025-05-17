export interface DashboardData {
    total_venues: number;
    active_venues: number;
    fields: {
        active: number;
        inactive: number;
    };
    top_5_venues_by_revenue: {
        venue_name: string;
        revenue: string;
    }[];
    top_5_booked_venue: {
        venue_name: string;
        booking_count: number;
    }[];
}