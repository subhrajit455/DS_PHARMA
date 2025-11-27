// Order Service
// ============================================================
// Handles all order-related API calls

import apiClient from './api/apiClient';
import { API_ENDPOINTS } from './api/baseURL';

export const orderService = {
  // Fetch all orders
  fetchOrders: () =>
    apiClient.get(API_ENDPOINTS.ORDERS),

  // Fetch order by ID
  fetchOrderById: (id) =>
    apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id)),

  // Create new order
  createOrder: (orderData) =>
    apiClient.post(API_ENDPOINTS.CREATE_ORDER, orderData),

  // Cancel order
  cancelOrder: (id) =>
    apiClient.put(API_ENDPOINTS.ORDER_BY_ID(id), { status: 'cancelled' }),

  // Track order
  trackOrder: (id) =>
    apiClient.get(API_ENDPOINTS.ORDER_BY_ID(id)),
};

export default orderService;
