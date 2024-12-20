import { configureStore } from '@reduxjs/toolkit'
import companyReducer from './companySlice'
import { enableMapSet } from 'immer'

enableMapSet()

const store = configureStore({
  reducer: {
    companies: companyReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
