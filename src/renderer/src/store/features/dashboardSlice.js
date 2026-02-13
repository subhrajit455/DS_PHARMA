import { createSlice } from '@reduxjs/toolkit'
import { dashboardApi } from '../../api'

const initialState = {
  lowStockProducts: [],
  expiredProducts: []
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLowStockProducts: (state, action) => {
      console.log('low stock :: ', action.payload)
      state.lowStockProducts = action.payload
    },
    setExpiredProducts: (state, action) => {
      state.expiredProducts = action.payload
    }
  }
})

export const { setLowStockProducts, setExpiredProducts } = dashboardSlice.actions

export default dashboardSlice.reducer
