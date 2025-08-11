import request from 'axios'

import $api from './api/index'
import { getCurrentUserNotification } from '../providers/reducers/UserSlice'
import type { AppDispatch } from '../providers/store'
import type { IProfile } from '../providers/types'
import { token } from '../../shared/utils/localStorage'

export const updateUserProfile = (formData: IProfile) => async (dispatch: AppDispatch) => {
  try {
    console.log('formData', formData)

    const response = await $api.put(`/profile`, formData)
    console.log('success', response.data)
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const uploadProfileImage = (file: File) => async (dispatch: AppDispatch) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await $api.post(`/profile/upload`, formData, {
      headers: { Authorization: token, 'Content-Type': 'multipart/form-data' },
      onDownloadProgress: (progressEvent) => {
        const totalLength = progressEvent.lengthComputable && progressEvent.total
        console.log('total length', totalLength)
        if (totalLength) {
          const progress = Math.round((progressEvent.loaded * 100) / totalLength)
          console.log('progress', progress)
        }
      },
    })

    console.log(' response.data?.url', response.data?.url)

    await $api.post(`/profile`, response.data?.url, {
      headers: { Authorization: token },
    })
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}

export const updateProfileImage = (formData: IProfile) => async (dispatch: AppDispatch) => {
  try {
    console.log('formData', formData)

    const response = await $api.put(`/profile`, formData)
    console.log('success', response.data)
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}
