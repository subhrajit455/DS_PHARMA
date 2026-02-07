import { createApi } from '@/config/api'
import { BASE_URLS } from './baseUrls'

export const desktopApi = createApi(BASE_URLS.DESKTOP)
export const websiteApi = createApi(BASE_URLS.WEBSITE)

export const authApi = {
  login: (data) => desktopApi.post('/auth/login', data),
  logout: () => desktopApi.post('/auth/logout')
}

export const customerApi = {
  getAllCustomers: (params) => desktopApi.get('/parties', { params }),
  getCustomerById: (id) => desktopApi.get(`/parties/${id}`),
  createCustomer: (data) => desktopApi.post('/parties', data),
  updateCustomer: (id, data) => desktopApi.put(`/parties/${id}`, data),
  deleteCustomer: (id) => desktopApi.delete(`/parties/${id}`)
}

export const categoryApi = {
  getAllCategories: (params) => desktopApi.get('/categories', { params }),
  getCategoryById: (id) => desktopApi.get(`/categories/${id}`),
  createCategory: (data) => desktopApi.post('/categories', data),
  updateCategory: (id, data) => desktopApi.put(`/categories/${id}`, data),
  deleteCategory: (id) => desktopApi.delete(`/categories/${id}`)
}

export const productApi = {
  getAllProducts: (params) => desktopApi.get('/products', { params }),
  getProductById: (id) => desktopApi.get(`/products/${id}`),
  createProduct: (data) => desktopApi.post('/products', data),
  updateProduct: (id, data) => desktopApi.put(`/products/update/${id}`, data),
  deleteProduct: (id) => desktopApi.delete(`/products/${id}`)
}

export const incomingOrderApi = {
  getAllIncomingOrders: (params) => websiteApi.get('/getallorder', { params }),
  getIncomingOrderById: (id) => websiteApi.get(`/orders/${id}`),
  updateIncomingOrder: (id, data) => websiteApi.put(`/orderstatusupdate/${id}`, data),
  deleteIncomingOrder: (id) => websiteApi.delete(`/orders/${id}`)
}

export const syncApi = {
  syncMasterData: () => desktopApi.get('/master-sync')
}

export const staffApi = {
  marggetAllStaff: (params) => desktopApi.get('/staff/marg-users'),
  getAllStaff: (params) => desktopApi.get('/staff'),
  getStaffById: (id) => desktopApi.get(`/staff/${id}`),
  createStaff: (data) => desktopApi.post('/staff/assign-staff', data),
  updateStaff: (id, data) => desktopApi.patch(`/staff/${id}`, data) // deleteStaff: (id) => desktopApi.delete(`/staff/${id}`)
}
