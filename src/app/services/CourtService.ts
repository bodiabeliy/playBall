import request from 'axios'
import $api from './api/index'
import type { AppDispatch } from '../providers/store'
import {
  getCurrentUserNotification,
} from '../providers/reducers/UserSlice'
import type { IClub, } from '../providers/types/club'
import { getCourts, getCurrentCourt } from '../providers/reducers/CourtSlice'




export const getAllCourts = (clubId:number) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/courts?club_id=${clubId}&sort_order=asc&page=1&size=50`, {
    })
    dispatch(getCourts(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const getCourtById = (id:number) => async (dispatch: AppDispatch) => {
  try {
    
    const response = await $api.get(`/clubs/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getCurrentCourt(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}



export const createClub = () => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.post(`/clubs`, )
    dispatch(getCurrentCourt(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}



export const updateClub = (clubId:number, updateClub:IClub) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.patch(`/clubs/${clubId}`, updateClub)
    dispatch(getCurrentCourt(response.data))
    return response.data;
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
    throw error;
  }
}

