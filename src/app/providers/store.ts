import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from './reducers/UserSlice'
import ClubReducer from './reducers/ClubSlice'
import PricingReducer from './reducers/PricingSlice'

import CourtReducer from './reducers/CourtSlice'


const rootReducer = combineReducers({
  UserReducer,
  ClubReducer,
  CourtReducer,
  PricingReducer
})

export const store = () => {
  return configureStore({
    reducer: rootReducer,
    devTools: true,
  })
}
export type AppStore = ReturnType<typeof store>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
