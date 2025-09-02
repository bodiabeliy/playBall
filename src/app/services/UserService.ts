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
import { clearTokens } from '../../shared/utils/tokenUtils'

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
    clearTokens()
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
    // Even if logout API fails, clear local tokens
    clearTokens()
    dispatch(isAuth(false))
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
// Refresh token function
export const refreshCurrentToken = () => async (dispatch: AppDispatch) => {
  try {
    const refreshToken = localStorage.getItem('refresh')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await $api.post(`/api/v1/club-panel/auth/token/refresh`, {
      refresh_token: refreshToken
    })
    
    console.log('Token refresh response:', response.data)

    if (response.data?.access_token) {
      localStorage.setItem('token', response.data.access_token)
      
      // Update refresh token if provided
      if (response.data?.refresh_token) {
        localStorage.setItem('refresh', response.data.refresh_token)
      }
      
      dispatch(isAuth(true))
      return { success: true }
    } else {
      throw new Error('No access token in response')
    }
  } catch (error) {
    console.error('Token refresh failed:', error)
    
    // Clear tokens and logout user
    clearTokens()
    dispatch(isAuth(false))
    
    let errorMessage = 'Token refresh failed'
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message || errorMessage
    }
    dispatch(getCurrentUserNotification(errorMessage))
    
    return { success: false, error: errorMessage }
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


export const changePassword = (oldPassword: string, newPassword: string) => async (dispatch: AppDispatch) => {
  try {
    await $api.post(`/club-panel/password/change`, { 
      old_password:oldPassword,
      new_password:newPassword
    })
    
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
