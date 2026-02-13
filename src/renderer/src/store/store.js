import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import categoryReducer from './features/categorySlice'
import customerReducer from './features/customerSlice'
import dashboardReducer from './features/dashboardSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    category: categoryReducer,
    customers: customerReducer,
    dashboard: dashboardReducer
  }
})
