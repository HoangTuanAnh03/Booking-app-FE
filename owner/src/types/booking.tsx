export interface Court {
  court_id: string;
  court_name:string;
  start_time: string; // Format: "HH:mm:ss"
  end_time: string;   // Format: "HH:mm:ss"
  price: string;      // e.g. "200,000.00"
}

export interface Booking {
  booking_id: string;
  field_id: string;
  booking_date: string; // Format: "YYYY-MM-DD"
  total_price: string;
  message: string | null;
  customer_name: string;
  customer_phone: string;
  status: 'completed'| 'pending' | 'cancelled' | string; // Extend as needed
  courts: Court[];
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface BookingStatsData {
  bookings: Booking[];
  total_completed_price: string;
  pagination: Pagination;
}

export interface BookingStatsResponse {
  status: number;
  message: string;
  data: BookingStatsData;
}


export interface CourtBookingStatsData {
  court_id: string;
  court_name:string;
  total_revenue: number;
}

export interface FieldBookingStatsData {
  field_id: string;
  field_name: string;
  total_revenue: number;
  courts: CourtBookingStatsData[];
}

export interface VenueBookingStatsData {
  venue_id: string;
  name: string;
  total_revenue: number;
  fields: FieldBookingStatsData[];
}

export interface BookingStatsData {
  total_revenue: number;
  venues: VenueBookingStatsData[];
}