import request from 'axios'

import $api from './api/index'

import type { AppDispatch } from '../providers/store'
import {
  getCurrentUserNotification,
} from '../providers/reducers/UserSlice'
// import type { IClub,  } from '../providers/types/club'
import { getClubs, getCurrentClub } from '../providers/reducers/ClubSlice'



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

