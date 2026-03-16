import { createApi } from '@/config/api'
import { BASE_URLS } from './baseUrls'

export const desktopApi = createApi(BASE_URLS.DESKTOP)
export const websiteApi = createApi(BASE_URLS.WEBSITE)

export const authApi = {
  login: (data) => desktopApi.post('/auth/login', data),
  logout: () => desktopApi.post('/auth/logout'),
  me: () => desktopApi.get('/auth/profile')
}

export const dashboardApi = {
  getExpiredProducts: (params) => desktopApi.get('/dashboard/expired', { params }),
  getExpiringProducts: (params) => desktopApi.get('/dashboard/expiring', { params }),
  getInventoryStats: () => desktopApi.get('/dashboard/inventory-stats'),
  getStockTrends: (params) => desktopApi.get('/dashboard/stock-trends', { params }),
  getCategoryDistribution: () => desktopApi.get('/dashboard/category-distribution')
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
  deleteProduct: (id) => desktopApi.delete(`/products/${id}`),
  getLowStockProducts: (params) => desktopApi.get('/products/low-stock', { params }),
  getExpiringProducts: (params) => desktopApi.get('/products/expiring', { params }),
  getExpiredProducts: (params) => desktopApi.get('/products/expired', { params })
}

export const incomingOrderApi = {
  getAllIncomingOrders: (params) => websiteApi.get('/getallorder', { params }),
  getIncomingOrderById: (id) => websiteApi.get(`/orders/${id}`),
  updateIncomingOrder: (id, data) => websiteApi.put(`/orderstatusupdate/${id}`, data),
  deleteIncomingOrder: (id) => websiteApi.delete(`/orders/${id}`),
  getOrderReport: (params) => websiteApi.get(`/order/monthly-report`, { params })
}

export const outgoingOrderApi = {
  createOutgoingOrder: (data, salesId) => desktopApi.post(`/order/${salesId}`, data),
  getOutgoingOrderBySalesId: (salesId, params) => desktopApi.get(`/order/${salesId}`, { params }),
  getAllOrders: (params) => desktopApi.get(`/order`, { params }),
  getOrdersReport: (params) => desktopApi.get(`/order/monthly-report`, { params })
}

export const syncApi = {
  syncMasterData: () => desktopApi.get('/master-sync'),
  createOrder: (payload) => desktopApi.post('/master-sync/order/301245', payload)
}

export const staffApi = {
  marggetAllStaff: (params) => desktopApi.get('/staff/marg-users'),
  getAllStaff: (params) => desktopApi.get('/staff'),
  getStaffById: (id) => desktopApi.get(`/staff/${id}`),
  createStaff: (data) => desktopApi.post('/staff', data),
  updateStaff: (id, data) => desktopApi.patch(`/staff/${id}`, data),
  getStaffOrders: (id, params) => desktopApi.get(`/order/${id}`, { params }),
  getStaffReports: (id, params) => desktopApi.get(`/staff/${id}/monthly-report`, { params })
}

export const createHsnCode = {
  getHsnCode: () => desktopApi.get('/hsn'),
  postHsnCode: (data) => desktopApi.post('/hsn', data)
}
