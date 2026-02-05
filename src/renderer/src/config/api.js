import axios from 'axios'

export const createApi = (baseURL) => {
  const api = axios.create({
    baseURL,
    // withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  )

  api.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message = error?.response?.data?.message || error.message || 'Something went wrong'

      return Promise.reject(message)
    }
  )

  return api
}
