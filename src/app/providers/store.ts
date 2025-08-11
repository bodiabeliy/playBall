import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UserReducer from './reducers/UserSlice'

const rootReducer = combineReducers({
  UserReducer,
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
