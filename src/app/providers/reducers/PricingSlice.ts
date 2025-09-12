import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IPricing, PricingResponse } from '../types/pricing'
import type { RootState } from '../store'

export interface PricingState {
  pricing: IPricing
  pricings: PricingResponse
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
  court_ids: [],
    courts: []
  },
  pricings: {
    items: [],
    total: 0,
    page: 1,
    size: 50,
    pages: 0,
  },
  isLoading: false,
  isError: false,
  notificationMessage: '',
}

export const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    getCurrentPricing: (state, action: PayloadAction<IPricing>) => {
      state.pricing = action.payload
    },
    getPricings: (state, action: PayloadAction<PricingResponse>) => {
      state.pricings = action.payload
      state.isLoading = false
    },
    clearPricings: (state) => {
      state.pricings = initialState.pricings
    },
    setPricingError: (state, action: PayloadAction<string>) => {
      state.isError = true
      state.notificationMessage = action.payload
      state.isLoading = false
    },
    clearPricingError: (state) => {
      state.isError = false
      state.notificationMessage = ''
    },
  },
})

export const {
  setLoading,
  getCurrentPricing,
  getPricings,
  clearPricings,
  setPricingError,
  clearPricingError,
} = pricingSlice.actions

export const pricingSelector = (state: RootState) => state.PricingReducer.pricing
export const pricingsSelector = (state: RootState) => state.PricingReducer.pricings
export const pricingLoadingSelector = (state: RootState) => state.PricingReducer.isLoading
export const pricingErrorSelector = (state: RootState) => state.PricingReducer.isError

export default pricingSlice.reducer
