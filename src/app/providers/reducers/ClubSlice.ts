import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IClub } from '../types/club'
import type { RootState } from '../store'

export interface clubState {
  club: IClub
  clubs:IClub[]
  isLoading: boolean
  isError: boolean
  notificationMessage: string
}

const initialState: clubState = {
  club: {
    name: '',
    address: '',
    city: '',
    id: 0,
    logo: undefined
  } ,
  clubs:[],
  isLoading: false,
  isError: false,
  notificationMessage: '',
}

export const clubState = createSlice({
  name: 'club',
  initialState,
  reducers: {
 
    getCurrentClub: (state, action: PayloadAction<IClub>) => {
      state.club = action.payload
    },
    getClubs: (state, action: PayloadAction<IClub[]>) => {
      state.clubs = action.payload
    },
  },
})

export const 
{ 
  getCurrentClub, 
  getClubs
} =
  clubState.actions

export const clubSelector = (state: RootState) => state.ClubReducer.club
export const clubsSelector = (state: RootState) => state.ClubReducer.clubs

export default clubState.reducer
