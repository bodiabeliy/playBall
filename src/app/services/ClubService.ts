import request from 'axios'
import $api from './api/index'
import type { AppDispatch } from '../providers/store'
import {
  getCurrentUserNotification,
} from '../providers/reducers/UserSlice'
import { getClubs, getClubStatistic, getCurrentClub, getCurrentClubSettings } from '../providers/reducers/ClubSlice'
import type { IClub, IClubSettings } from '../providers/types/club'
import { compressImage, uploadClubGallery } from './FileService'
import type { IOpenHour } from '../providers/types/hours'



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

export const getAllClubStatistic = (clubId:number) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.get(`/clubs/${clubId}/court-stats`, {
      headers: {
        Authorization: localStorage.getItem('token'),
      },
    })
    dispatch(getClubStatistic(response.data))
    console.log("response.data", response.data);
    
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

export const updateOpenHours = (clubId:number, updateHours:IOpenHour) => async (dispatch: AppDispatch) => {
  try {
    console.log("Updating working hours with:", updateHours);
    const response = await $api.put(`/clubs/${clubId}/working-hours`, updateHours)
    dispatch(getCurrentClub(response.data))
    return response.data;
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      console.error('Working hours update error:', error.response.data);
      dispatch(getCurrentUserNotification(errorMessage))
    }
    throw error;
  }
}







/**
 * Upload club logo or banner through your API
 * @param clubId - ID of the club
 * @param field - Field name (logo_image or banner_image)
 * @param file - File to upload
 * @returns Updated club data
 */
export const uploadClubSingleImage = (clubId: number, field: 'logo_image' | 'banner_image', file: File) => async (dispatch: AppDispatch) => {
  try {
    // First compress the image
    const compressedFile = await compressImage(file);
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', compressedFile);
    
    // Upload the image through your API
    const response = await $api.post(`/clubs/${clubId}/upload/${field}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.getItem('token'),
      }
    });
    
    // Update club in Redux store
    dispatch(getCurrentClub(response.data));
    return response.data;
  } catch (error) {
    let errorMessage = '';
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message;
      dispatch(getCurrentUserNotification(errorMessage));
    }
    throw error;
  }
}

/**
 * Upload multiple images to club gallery through Directus
 * @param clubId - ID of the club
 * @param files - Array of files to upload
 * @returns Array of file IDs
 */
export const uploadClubGalleryImages = (clubId: number, files: File[]) => async (dispatch: AppDispatch) => {
  try {
    // Upload files to Directus and link them to the club
    const fileIds = await uploadClubGallery(clubId, files);
    
    // Fetch updated club data to refresh the gallery
    dispatch(getClubById(clubId));
    
    return fileIds;
  } catch (error) {
    let errorMessage = '';
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message;
      dispatch(getCurrentUserNotification(errorMessage));
    } else if (error instanceof Error) {
      errorMessage = error.message;
      dispatch(getCurrentUserNotification(errorMessage));
    }
    throw error;
  }
}


export const updateClubSettings = (clubId:number, updateSettings:IClubSettings) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.patch(`/clubs/${clubId}/settings`, updateSettings)
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

