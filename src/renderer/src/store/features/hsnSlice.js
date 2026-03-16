import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hsnCodes: [],
  loading: false,
  error: null
}

const hsnSlice = createSlice({
  name: 'hsn',
  initialState,
  reducers: {
    setHsnCodes: (state, action) => {
      state.hsnCodes = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setHsnCodes, setLoading, setError } = hsnSlice.actions
export default hsnSlice.reducer
