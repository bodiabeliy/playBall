export interface ICourt {
    items?:ICourtItem[]
}

export interface ICourtItem {
    name: string,
    sport_type: string,
    court_type: string,
    description: string,
    category: string,
    is_active: boolean,
    id: number,
    club_id: number
}
