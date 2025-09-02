export interface IOpenHour {
  working_hours: IWorkingHourItem[]
}

export interface IWorkingHourItem {
  day_of_week: number
  is_active: boolean
  start_time: string
  end_time: string
}
