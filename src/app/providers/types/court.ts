export interface ICourt {
    id: number;
    name: string;
    sport_type: string;
    court_type: string;
    description: string;
    category?: string;
    is_active: boolean;
    club_id: number;
}

export interface CourtsResponse {
    items: ICourt[];
    total: number;
    page: number;
    size: number;
    pages: number;
}
