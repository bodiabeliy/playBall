export interface PricingFilterValues {
  search: string
  sport_type: string
  start_date: string
  end_date: string
  is_timed: string
  sort_by: string
  sort_order: string
}

export const PRICING_SPORT_TYPES = [
  { value: '', label: 'All Sports' },
  { value: 'padel', label: 'Padel' },
  { value: 'tennis', label: 'Tennis' },
  { value: 'pickleball', label: 'Pickleball' },
]

export const PRICING_SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'end_date', label: 'End Date' },
]

export const PRICING_TIMED_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'true', label: 'Timed' },
  { value: 'false', label: 'Fixed' },
]
