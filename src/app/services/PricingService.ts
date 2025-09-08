import request from 'axios'
import $api from './api/index'
import type { AppDispatch } from '../providers/store'
import { getCurrentUserNotification } from '../providers/reducers/UserSlice'
import { getPricings, getCurrentPricing } from '../providers/reducers/PricingSlice'
import type { IPricing } from '../providers/types/pricing'




export const getAllPricings = (clubId: number, page: number = 1, size: number = 50, search: string = '', sport_type: string = '', Pricing_type: string = '', sort_by: string = 'name', sort_order: string = 'asc',) => async (dispatch: AppDispatch) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort_order
    });
    
    if (search) params.append('search', search);
    if (sport_type) params.append('sport_type', sport_type);
    if (Pricing_type) params.append('Pricing_type', Pricing_type);
    if (sort_by) params.append('sort_by', sort_by);
    
    const response = await $api.get(`/clubs/${clubId}/price-policies?${params.toString()}`);
    dispatch(getPricings(response.data));
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





export const createPricing = (clubId:number, createdPricing:IPricing) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.post(`/clubs/${clubId}/price-policies`, createdPricing)
    dispatch(getCurrentPricing(response.data))
  } catch (error) {
    let errorMessage = ''
    if (request.isAxiosError(error) && error.response) {
      errorMessage = error.response?.data?.message
      dispatch(getCurrentUserNotification(errorMessage))
    }
  }
}


// export const updatePricing = (PricingId:number, updatedPricing:IPricing) => async (dispatch: AppDispatch) => {
//   try {
//     const response = await $api.put(`/Pricings/${PricingId}`, updatedPricing)
//     dispatch(getCurrentPricing(response.data))
//     return response.data;
//   } catch (error) {
//     let errorMessage = ''
//     if (request.isAxiosError(error) && error.response) {
//       errorMessage = error.response?.data?.message
//       dispatch(getCurrentUserNotification(errorMessage))
//     }
//     throw error;
//   }
// }

export const deletePricing = (clubId:number,policyId:number) => async (dispatch: AppDispatch) => {
  try {
    const response = await $api.delete(`/clubs/${clubId}/price-policies/${policyId}`)
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

