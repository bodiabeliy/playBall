import request from 'axios'

import $api from './api/index'

import type { AppDispatch } from '../providers/store'
import {
  getCurrentUserNotification,
} from '../providers/reducers/UserSlice'
// import type { IClub,  } from '../providers/types/club'
import { getClubs, getCurrentClub, getCurrentClubSettings } from '../providers/reducers/ClubSlice'
import type { IClub, IClubSettings } from '../providers/types/club'



export const getAllClubs = () => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/clubs/my-clubs`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getClubs(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const getClubById = (id:number) => async (dispatch: AppDispatch) => {
  try {
    
    const response = await $api.get(`/clubs/${id}`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getCurrentClub(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}


export const getClub = () => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/auth/me`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getCurrentClub(response.data))
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
    dispatch(getCurrentClub(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const getClubSettings = (clubId:number) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/clubs/${clubId}/settings`)
    console.log("response.data get club settings:", response.data);
    
    dispatch(getCurrentClubSettings(response.data))
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

export const updateClub = (clubId:number, updateClub:IClub) => async (dispatch: AppDispatch) => {
  try {
    console.log("Updating club settings with:", updateClub);
    const response = await $api.patch(`/clubs/${clubId}`, updateClub)
    dispatch(getCurrentClub(response.data))
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


export const updateClubSettings = (clubId:number, updateSettings:IClubSettings) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.patch(`/clubs/${clubId}/settings`, updateSettings)
    console.log("Update club settings response:", response.data);
    dispatch(getCurrentClubSettings(response.data))
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

