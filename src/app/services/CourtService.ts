import request from 'axios'
import $api from './api/index'
import type { AppDispatch } from '../providers/store'
import {
  getCurrentUserNotification,
} from '../providers/reducers/UserSlice'
import { getCourts, getCurrentCourt } from '../providers/reducers/CourtSlice'
import type { ICourt } from '../providers/types/court'




export const getAllCourts = (clubId: number, page: number = 1, size: number = 50, search: string = '', sport_type: string = '', court_type: string = '', sort_by: string = 'name', sort_order: string = 'asc') => async (dispatch: AppDispatch) => {
  try {
    const params = new URLSearchParams({
      club_id: String(clubId),
      page: String(page),
      size: String(size),
      sort_order
    });
    
    if (search) params.append('search', search);
    if (sport_type) params.append('sport_type', sport_type);
    if (court_type) params.append('court_type', court_type);
    if (sort_by) params.append('sort_by', sort_by);
    
    const response = await $api.get(`/courts?${params.toString()}`);
    dispatch(getCourts(response.data));
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



export const createCourt = (clubId:number, createdCourt:ICourt) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.post(`/courts?club_id=${clubId}`, createdCourt)
    dispatch(getCurrentCourt(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}


export const updateCourt = (courtId:number, updatedCourt:ICourt) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.put(`/courts/${courtId}`, updatedCourt)
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

export const deleteCourt = (clubId:number, courtId:number) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.delete(`/courts/${courtId}?club_id=${clubId}`)
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

