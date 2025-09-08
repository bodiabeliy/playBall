import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPricing } from '../types/pricing'
import type { RootState } from '../store'

export interface PricingState {
  pricing: IPricing
  pricings:IPricing[]
  isLoading: boolean
  isError: boolean
  notificationMessage: string
}

const initialState: PricingState = {
  pricing: {
    name: '',
    description: '',
    is_timed: false,
    start_date: '',
    end_date: '',
    price_segments: [],
    courts: []
  } ,
  pricings:[],
  isLoading: false,
  isError: false,
  notificationMessage: '',
}

export const PricingState = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
 
    getCurrentPricing: (state, action: PayloadAction<IPricing>) => {
      state.pricing = action.payload
    },
    getPricings: (state, action: PayloadAction<IPricing[]>) => {
      state.pricings = action.payload
    },   
  },
})

export const 
{ 
  getCurrentPricing, 
  getPricings,

} =
  PricingState.actions

export const pricingSelector = (state: RootState) => state.PricingReducer.pricing
export const pricingsSelector = (state: RootState) => state.PricingReducer.pricings


export default PricingState.reducer
