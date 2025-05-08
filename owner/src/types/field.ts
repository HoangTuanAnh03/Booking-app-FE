export interface OpeningHourToday {
    field_id: string;
    day_of_week: string;
    opening_time: string;
    closing_time: string;
  }
  
  export interface Field {
    field_id: string;
    venue_id: string;
    sport_type_id: number;
    field_name: string;
    default_price: string;
    is_active: number;
    created_at: string;
    updated_at: string;
    opening_hour_today: OpeningHourToday;
  }
  
  export interface FieldPaginationMeta {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  
  export interface FieldPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  export interface FieldResponseData extends FieldPaginationMeta {
    data: Field[];
    links: FieldPaginationLink[];
  }
  
  export interface FieldApiResponse {
    status: number;
    message: string;
    data: FieldResponseData;
  }
  