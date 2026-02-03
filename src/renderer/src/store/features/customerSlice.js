import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customers: [],
  totalCustomers: 0,
  loading: false,
  error: null
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload
      state.totalCustomers = action.payload.length
      state.loading = false
      state.error = null
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    }
  }
})

export const { setCustomers, setLoading, setError } = customerSlice.actions
export default customerSlice.reducer
