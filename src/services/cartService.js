// Cart Service
// ============================================================
// Handles all cart-related API calls

import apiClient from './api/apiClient';
import { API_ENDPOINTS } from './api/baseURL';

export const cartService = {
  // Fetch cart
  fetchCart: () =>
    apiClient.get(API_ENDPOINTS.CART),

  // Add item to cart
  addToCart: (product) =>
    apiClient.post(API_ENDPOINTS.CART_ADD, product),

  // Update cart item quantity
  updateCartItem: (itemId, quantity) =>
    apiClient.put(API_ENDPOINTS.CART_UPDATE, { itemId, quantity }),

  // Remove item from cart
  removeFromCart: (itemId) =>
    apiClient.delete(API_ENDPOINTS.CART_REMOVE, { data: { itemId } }),

  // Clear cart
  clearCart: () =>
    apiClient.delete(API_ENDPOINTS.CART),
};

export default cartService;
