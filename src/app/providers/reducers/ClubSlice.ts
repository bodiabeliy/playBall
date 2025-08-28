import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { IClub, IClubSettings, IClubStatistic } from '../types/club'
import type { RootState } from '../store'

export interface clubState {
  club: IClub
  clubs:IClub[]
  clubSettings:IClubSettings
  clubStatistic:IClubStatistic
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
  } ,
  clubSettings:{
    cancellation_enabled: false,
    cancellation_duration: 0,
    light_prior_duration: 0,
    light_after_duration: 0,
    access_code_prior_duration: 0,
    access_code_after_duration: 0
  },
  clubStatistic:{
    indoor_padel: 0,
    outdoor_tennis: 0,
    outdoor_padel: 0,
    indoor_tennis: 0
  },
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

    getClubStatistic: (state, action: PayloadAction<IClubStatistic>) => {
      state.clubStatistic = action.payload
    },

    getCurrentClubSettings: (state, action: PayloadAction<IClubSettings>) => {
      state.clubSettings = action.payload
    },

    updateCurrentClubSettings: (state, action: PayloadAction<IClubSettings>) => {
      state.clubSettings = action.payload
    },
  },
})

export const 
{ 
  getCurrentClub, 
  getClubs,

  getCurrentClubSettings,
  updateCurrentClubSettings,

  getClubStatistic
} =
  clubState.actions

export const clubSelector = (state: RootState) => state.ClubReducer.club
export const clubsSelector = (state: RootState) => state.ClubReducer.clubs
export const clubSettingsSelector = (state: RootState) => state.ClubReducer.clubSettings
export const clubStatisticSelector = (state: RootState) => state.ClubReducer.clubStatistic


export default clubState.reducer
