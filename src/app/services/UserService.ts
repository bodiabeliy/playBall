import request from 'axios'

import $api from './api/index'
import {
  getCurrentUser,
  getCurrentUserNotification,
  getCurrentUserSuccess,
  isAuth,
} from '../providers/reducers/UserSlice'
import type { AppDispatch } from '../providers/store'
import type { IUser, IUserDto } from '../providers/types/user'

import { CONFIRMATION_TYPES } from './api/constants'

export const registerUser = (formData: IUser) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.post('/auth/register', formData)
    console.log('response rergister', response.data)
    dispatch(getCurrentUserSuccess())
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
export const login = (formData: IUserDto) => async (dispatch: AppDispatch) => {
  const { email, password } = formData
  try {
    const response = await $api.post(`/club-panel/auth/sign-in`, {
      email,
      password,
    })
    dispatch(isAuth(true))
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('refresh', response.data.refresh_token)

    return { success: true }
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
    return { success: false, error: errorMessage }
  }
}

export const logout = () => async (dispatch: AppDispatch) => {
  try {
    await $api.post(`/club-panel/auth/sign-out`)
    dispatch(isAuth(false))
    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const getUser = () => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/auth/me`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getCurrentUser(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
// not realize yet
export const refreshCurrentToken = () => async () => {
  try {
    const response = await $api.get(`/club-panel/auth/token/refresh`, 
    { withCredentials: true })
    console.log('response check', response)

    console.log('response.data', response.data)
    localStorage.setItem('token', response.data.token)
  } catch (error) {
    throw Error(`heppend error by getting user!  ${error}`)
  }
}

export const codeRequestConfirmate = (email: string, confirmationType: string) => async (dispatch: AppDispatch) => {
  if (confirmationType == CONFIRMATION_TYPES.resetPassword) {
    try {
      const response = await $api.post(`/club-panel/password/request-reset`, { email })
      console.log('response request confirm', response.data)
      dispatch(getCurrentUserNotification(response.data?.message))
    } catch (error) {
      let errorMessage = ''
      if (request.isAxiosError(error) && error.response) {
        errorMessage = error.response?.data?.message
        dispatch(getCurrentUserNotification(errorMessage))
      }
    }
  }
  // if (confirmationType == CONFIRMATION_TYPES.registerAccount) {
  //   try {
  //     const response = await $api.post(`/auth/request-confirm-email`, { email })
  //     console.log('response request confirm', response.data)
  //   } catch (error) {
  //     let errorMessage = ''
  //     if (request.isAxiosError(error) && error.response) {
  //       errorMessage = error.response?.data?.message
  //       dispatch(getCurrentUserNotification(errorMessage))
  //     }
  //   }
  // }
}

export const codeConfirmate = (email: string, code: string) => async (dispatch: AppDispatch) => {
  try {
    await $api.post(`/club-panel/password/verify-reset`, { email, code })
    // localStorage.setItem('token', response.data.accessToken)
    // dispatch(isAuth(true))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
export const resetPassword = (email: string, code: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.post(`/club-panel/password/confirm-reset`, { email, code, password })
    console.log('success', response.data)
    localStorage.setItem('token', response.data.accessToken)
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
