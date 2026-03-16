import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
import categoryReducer from './features/categorySlice'
import dashboardReducer from './features/dashboardSlice'
import hsnReducer from './features/hsnSlice'

// Rehydrate auth from localStorage so session persists on page refresh
const token = localStorage.getItem('token')
const salerId = localStorage.getItem('salerId')
const role = localStorage.getItem('role')

const preloadedState = token
  ? {
      auth: {
        user: salerId ? { userId: salerId, role } : null,
        token
      }
    }
  : {}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    dashboard: dashboardReducer,
    hsn: hsnReducer
  },
  preloadedState,
  devTools: true
})
