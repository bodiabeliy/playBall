import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { ICourt } from '../types/court'
import type { RootState } from '../store'

export interface CourtState {
  court: ICourt
  courts:ICourt[]
 
  isLoading: boolean
  isError: boolean
  notificationMessage: string
}

const initialState: CourtState = {
  court: {},

  courts:[],
  isLoading: false,
  isError: false,
  notificationMessage: '',
}

export const CourtState = createSlice({
  name: 'court',
  initialState,
  reducers: {
 
    getCurrentCourt: (state, action: PayloadAction<ICourt>) => {
      state.court = action.payload
    },
    getCourts: (state, action: PayloadAction<ICourt[]>) => {
      state.courts = action.payload
    },
  },
})

export const 
{ 
  getCurrentCourt, 
  getCourts
} =
  CourtState.actions

export const courtSelector = (state: RootState) => state.CourtReducer.court
export const courtsSelector = (state: RootState) => state.CourtReducer.courts



export default CourtState.reducer
