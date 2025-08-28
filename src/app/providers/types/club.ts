export interface IClub {
  id:number
  name: string,
  address:string,
  city: string,
  latitude?: number,
  longitude?: number,
  amenities?: string[],
  phone?: string,
  email?: string,
  about?: string,
  website?: string,
  instagram?: string,
  facebook?: string
  logo_image?: string,
  banner_image?: string,
  gallery?: string[],
  working_hours?: IWorkingHours[],
  security_settings?: {
    cancellation_policy?: {
      enabled: boolean,
      time_limit: number,
      penalty_percentage: number
    },
    lighting_control?: {
      automatic: boolean,
      turn_on_before: number
    },
    access_code?: {
      enabled: boolean,
      code: string
    }
  }
}

export interface IWorkingHours {
  day_of_week: number,
  is_active: boolean,
  start_time: Date,
  end_time: Date
}


export interface IClubSettings {
  cancellation_enabled?: boolean,
  cancellation_duration?: number,
  light_prior_duration?: number,
  light_after_duration?: number,
  access_code_prior_duration?: number,
  access_code_after_duration?: number
}
