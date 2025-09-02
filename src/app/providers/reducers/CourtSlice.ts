import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ICourt } from '../types/court'
import type { RootState } from '../store'

interface CourtsResponse {
  items: ICourt[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CourtState {
  court: ICourt;
  courts: CourtsResponse;
  isLoading: boolean;
  isError: boolean;
  notificationMessage: string;
}

const initialState: CourtState = {
  court: {} as ICourt,
  courts: {
    items: [],
    total: 0,
    page: 1,
    size: 50,
    pages: 0
  },
  isLoading: false,
  isError: false,
  notificationMessage: '',
}

export const CourtState = createSlice({
  name: 'court',
  initialState,
  reducers: {
    getCurrentCourt: (state, action: PayloadAction<ICourt>) => {
      state.court = action.payload;
    },
    getCourts: (state, action: PayloadAction<CourtsResponse>) => {
      state.courts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    setNotification: (state, action: PayloadAction<string>) => {
      state.notificationMessage = action.payload;
    }
  },
})

export const { 
  getCurrentCourt, 
  getCourts,
  setLoading,
  setError,
  setNotification
} = CourtState.actions

export const courtSelector = (state: RootState) => state.CourtReducer.court
export const courtsSelector = (state: RootState) => state.CourtReducer.courts
export const loadingSelector = (state: RootState) => state.CourtReducer.isLoading
export const errorSelector = (state: RootState) => state.CourtReducer.isError
export const notificationSelector = (state: RootState) => state.CourtReducer.notificationMessage

export default CourtState.reducer
