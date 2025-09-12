export interface IPriceSegment {
  id?: number;
  name: string;
  start_time: string; // ISO 8601 time format like "15:59:15.910Z"
  end_time: string;   // ISO 8601 time format like "15:59:15.910Z"
  price: number;
  color: string;      // Hex color like "#84E81D"
  days_of_week: number[]; // Array of day numbers (0 = Sunday, 1 = Monday, etc.)
}

export interface IPricingCourt {
  id: number;
  name: string;
  sport_type: string; // e.g., "tennis", "padel", etc.
}

export interface IPricing {
  id?: number;
  name: string;
  description: string;
  is_timed: boolean;
  start_date: string; // ISO 8601 date format like "2025-09-08"
  end_date: string;   // ISO 8601 date format like "2025-09-08"
  price_segments: IPriceSegment[];
  court_ids:string[]
  courts: IPricingCourt[];
}

export interface PricingResponse {
  items: IPricing[];
  total: number;
  page: number;
  size: number;
  pages: number;
}