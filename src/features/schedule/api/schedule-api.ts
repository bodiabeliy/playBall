import { apiClient } from '../../../shared/api/client'
import type { ApiResponse } from '../../../shared/api/client'
import type { PatientsStatuses } from '../../calendar'
import type { Event, Visit, ScheduleData, MultiDayScheduleData } from '../types/schedule-types'
import { parse, format } from 'date-fns'

export interface Cabinet {
  id: number
  name: string
  color: string
}

export interface Doctor {
  id: number
  name: string
  avatar: string
  color: string
}

export interface UserSettings {
  id: number
  userId: number
  enabledCabinets: number[]
  selectedDoctor: number | null
  showOnlySelectedDoctor: boolean
  numberOfDays: number
  scheduleSize: 'none' | 'shrink'
}

export const mapApiVisitToEvent = (
  visit: Visit & {
    patientId?: number
    planned_start?: string
    planned_end?: string
    actual_start?: string
    actual_end?: string
    assistant?: { id: number; name: string; avatar: string }
    doctorId?: number
  },
  cabinetId: number,
  date: string,
  patients?: Visit['patient'][],
  doctors?: Doctor[]
): Event => {
  const visitStart = new Date(visit.visit_start)
  const visitEnd = new Date(visit.visit_end)

  if (visit.type === 'assistant') {
    // @ts-expect-error - TODO: fix this
    return {
      id: visit.id,
      roomId: cabinetId,
      doctorId: 0,
      patientId: 0,
      start: format(visitStart, 'HH:mm'),
      end: format(visitEnd, 'HH:mm'),
      status: visit.status,
      note: visit.note,
      type: 'assistant',
      date: date,
      assistant: visit.assistant || { id: 0, name: '', avatar: '' },
      planned_start: visit.planned_start,
      planned_end: visit.planned_end,
      actual_start: visit.actual_start,
      actual_end: visit.actual_end,
    }
  }

  const patientId = visit.patientId ?? visit.patient?.id
  let patient = visit.patient
  if (!patient && patients && patientId) {
    // @ts-expect-error - TODO: fix this
    patient = patients.find((p) => p.id === patientId)
  }

  if (!patient) {
    throw new Error(`Patient not found for visit ${visit.id}`)
  }

  let doctor = visit.doctor
  if (!doctor && doctors && visit.doctorId) {
    const foundDoctor = doctors.find((d) => d.id === visit.doctorId)
    if (foundDoctor) {
      doctor = foundDoctor
    }
  }

  if (!doctor) {
    throw new Error(`Doctor not found for visit ${visit.id}`)
  }

  // Always include doctor.color
  let doctorColor = doctor.color
  if (!doctorColor && doctors) {
    const foundDoctor = doctors.find((d) => d.id === doctor.id)
    if (foundDoctor) doctorColor = foundDoctor.color
  }
  doctor = { ...doctor, color: doctorColor || '' }

  return {
    id: visit.id,
    roomId: cabinetId,
    doctorId: visit.doctorId || doctor.id,
    patientId: patientId ?? 0,
    start: format(visitStart, 'HH:mm'),
    end: format(visitEnd, 'HH:mm'),
    status: visit.status,
    note: visit.note,
    type: 'visit',
    characteristic: visit.characteristic,
    date: date,
    patient: patient as Visit['patient'],
    doctor: doctor as Visit['doctor'],
  }
}

const mapEventToVisit = (event: Event): Visit => {
  const visitStart = parse(`${event.date} ${event.start}`, 'yyyy-MM-dd HH:mm', new Date())
  const visitEnd = parse(`${event.date} ${event.end}`, 'yyyy-MM-dd HH:mm', new Date())

  const visit = {
    id: event.id,
    visit_start: visitStart.toISOString(),
    visit_end: visitEnd.toISOString(),
    patient: {
      id: event.patientId,
      name: event.patient?.name || '',
      avatar: event.patient?.avatar || '',
      age: 0,
      phone: '',
      important_note: '',
      advance: 0,
    },
    doctor: {
      id: event.doctorId,
      name: event.doctor?.name || '',
      avatar: event.doctor?.avatar || '',
    },
    doctorId: event.doctorId,
    status: {
      ...event.status,
      order: event.status.order || 1,
    },
    note: event.note || '',
    reference_id: event.id,
    characteristic: event.characteristic,
  }

  return visit as Visit & { doctorId: number }
}

export const fetchScheduleData = async (dateKey: string): Promise<ApiResponse<ScheduleData>> => {
  try {
    const response = await apiClient.get('/clinics/1/schedule')
    let allScheduleData: MultiDayScheduleData = response.data

    if (!allScheduleData) {
      console.warn('Schedule data is undefined, returning empty schedule')
      allScheduleData = {}
    }

    const data = allScheduleData[dateKey]

    if (!data) {
      throw new Error('Schedule data not found for the specified date')
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const fetchAllScheduleData = async (): Promise<ApiResponse<MultiDayScheduleData>> => {
  try {
    const response = await apiClient.get('/clinics/1/schedule')
    let allScheduleData: MultiDayScheduleData = response.data

    if (!allScheduleData) {
      console.warn('Schedule data is undefined, returning empty object')
      allScheduleData = {}
    }

    return {
      success: true,
      data: allScheduleData,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const updateEvent = async (event: Event): Promise<ApiResponse<Event>> => {
  try {
    const visit = mapEventToVisit(event)

    const response = await apiClient.get('/clinics/1/schedule')
    let allScheduleData: MultiDayScheduleData = response.data

    if (!allScheduleData) {
      console.warn('Schedule data is undefined, creating empty structure')
      allScheduleData = {}
    }

    const targetDateKey = event.date
    const targetScheduleData = allScheduleData[targetDateKey]
    if (!targetScheduleData) {
      throw new Error(`No schedule data for date ${targetDateKey}`)
    }
    const targetCabinet = targetScheduleData.cabinets.find((cabinet) => cabinet.id === event.roomId)
    if (!targetCabinet) {
      throw new Error(`Cabinet with ID ${event.roomId} not found in date ${targetDateKey}`)
    }

    // Find the shift that contains this visit
    let visitUpdated = false
    for (const shift of targetCabinet.shifts || []) {
      const visitIndex = shift.visits.findIndex((v) => v.id === event.id)
      if (visitIndex !== -1) {
        shift.visits[visitIndex] = visit
        visitUpdated = true
        break
      }
    }
    if (!visitUpdated) {
      throw new Error(`Visit with ID ${event.id} not found in any shift in cabinet ${event.roomId}`)
    }

    await apiClient.put('/clinics/1/schedule', allScheduleData)
    return {
      success: true,
      data: event,
    }
  } catch (error) {
    console.error('Error updating event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const deleteEvent = async (eventId: number): Promise<ApiResponse<boolean>> => {
  try {
    const response = await apiClient.get('/clinics/1/schedule')
    const allScheduleData: MultiDayScheduleData = response.data

    if (!allScheduleData) {
      console.warn('Schedule data is undefined, nothing to delete')
      return {
        success: false,
        error: 'No schedule data available to delete from',
      }
    }

    let visitDeleted = false
    for (const scheduleData of Object.values(allScheduleData)) {
      for (const cabinet of scheduleData.cabinets) {
        for (const shift of cabinet.shifts || []) {
          if (shift.visits) {
            const visitIndex = shift.visits.findIndex((v) => v.id === eventId)
            if (visitIndex !== -1) {
              shift.visits.splice(visitIndex, 1)
              visitDeleted = true
              break
            }
          }
        }
        if (visitDeleted) break
      }
      if (visitDeleted) break
    }

    if (!visitDeleted) {
      throw new Error(`Visit with ID ${eventId} not found in any shift`)
    }

    await apiClient.put('/clinics/1/schedule', allScheduleData)

    return {
      success: true,
      data: true,
    }
  } catch (error) {
    console.error('Error deleting event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const createEvent = async (event: Omit<Event, 'id'> & { shiftId?: number }): Promise<ApiResponse<Event>> => {
  try {
    const newId = Date.now()
    const visit = mapEventToVisit({ ...event, id: newId })

    const response = await apiClient.get('/clinics/1/schedule')
    let allScheduleData: MultiDayScheduleData = response.data
    if (!allScheduleData) {
      console.error('Schedule data is undefined, creating empty structure')
      const emptyScheduleData: MultiDayScheduleData = {}
      allScheduleData = emptyScheduleData
    }

    const targetDateKey = event.date
    const targetScheduleData = allScheduleData[targetDateKey]
    if (!targetScheduleData) {
      throw new Error(`No schedule data for date ${targetDateKey}`)
    }
    const targetCabinet = targetScheduleData.cabinets.find((cabinet) => cabinet.id === event.roomId)
    if (!targetCabinet) {
      throw new Error(`Cabinet with ID ${event.roomId} not found in date ${targetDateKey}`)
    }

    // Find the correct shift
    let shift = null
    if (event.shiftId) {
      shift = (targetCabinet.shifts || []).find((s) => s.id === event.shiftId)
    } else {
      // Try to find a shift that matches the visit's time
      shift = (targetCabinet.shifts || []).find((s) => {
        return s.date === event.date && s.cabinetId === event.roomId && event.start >= s.start && event.end <= s.end
      })
    }
    if (!shift) {
      throw new Error('No matching shift found for this visit')
    }
    if (!shift.visits) shift.visits = []
    shift.visits.push(visit)

    await apiClient.put('/clinics/1/schedule', allScheduleData)
    return {
      success: true,
      data: { ...event, id: newId },
    }
  } catch (error) {
    console.error('Error creating event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getAllPatients = async (): Promise<ApiResponse<Visit['patient'][]>> => {
  try {
    const response = await apiClient.get('/patients')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getAllDoctors = async (): Promise<ApiResponse<Doctor[]>> => {
  try {
    const response = await apiClient.get('/doctors')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getAllCabinets = async (): Promise<ApiResponse<Cabinet[]>> => {
  try {
    const response = await apiClient.get('/cabinets')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getUserSettings = async (userId: number = 1): Promise<ApiResponse<UserSettings>> => {
  try {
    const response = await apiClient.get(`/user_settings?userId=${userId}`)
    const settings = response.data.find((setting: UserSettings) => setting.userId === userId)

    if (!settings) {
      return {
        success: true,
        data: {
          id: 1,
          userId,
          enabledCabinets: [1, 2, 3],
          selectedDoctor: null,
          showOnlySelectedDoctor: false,
          numberOfDays: 5,
          scheduleSize: 'none' as const,
        },
      }
    }

    return {
      success: true,
      data: settings,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const updateUserSettings = async (settings: UserSettings): Promise<ApiResponse<UserSettings>> => {
  try {
    await apiClient.put(`/user_settings/${settings.id}`, settings)
    return {
      success: true,
      data: settings,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getAllRooms = async (): Promise<ApiResponse<{ id: number; name: string; color: string }[]>> => {
  try {
    const response = await apiClient.get('/cabinets')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

export const getPatientsStatuses = async (): Promise<ApiResponse<{ id: number; value: PatientsStatuses }[]>> => {
  try {
    const response = await apiClient.get('/patients_statuses')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
