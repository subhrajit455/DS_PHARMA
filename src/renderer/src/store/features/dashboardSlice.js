import { createSlice } from '@reduxjs/toolkit'
import { dashboardApi } from '../../api'

const initialState = {
  lowStockProducts: {
    products: [],
    totalCount: 0,
    loading: false,
    error: null
  },
  expiredProducts: {
    products: [],
    totalCount: 0,
    loading: false,
    error: null
  }
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLowStockProducts: (state, action) => {
      state.lowStockProducts.products = action.payload.products
      state.lowStockProducts.totalCount = action.payload.totalCount
    },
    setExpiredProducts: (state, action) => {
      state.expiredProducts.products = action.payload.products
      state.expiredProducts.totalCount = action.payload.totalCount
    },
    setLowStockLoading: (state, action) => {
      state.lowStockProducts.loading = action.payload
    },
    setExpiredLoading: (state, action) => {
      state.expiredProducts.loading = action.payload
    },
    setLowStockError: (state, action) => {
      state.lowStockProducts.error = action.payload
    },
    setExpiredError: (state, action) => {
      state.expiredProducts.error = action.payload
    }
  }
})

export const {
  setLowStockProducts,
  setExpiredProducts,
  setLowStockLoading,
  setExpiredLoading,
  setLowStockError,
  setExpiredError
} = dashboardSlice.actions

export default dashboardSlice.reducer
