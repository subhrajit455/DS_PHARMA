import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";
import { mockCartService } from "./mockCartService";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;

export const cartService = {
  getCart: async () => {
    if (USE_MOCK) return mockCartService.getCart();
    return apiClient.get(API_ENDPOINTS.CART);
  },

  addToCart: async (productId, quantity) => {
    if (USE_MOCK) return mockCartService.addToCart({ id: productId, quantity });
    return apiClient.post(API_ENDPOINTS.CART_ADD, { productId, quantity });
  },

  // Method to handle full item object (common in UI currently)
  addItem: async (item) => {
    if (USE_MOCK) return mockCartService.addToCart(item);
    return apiClient.post(API_ENDPOINTS.CART_ADD, {
      productId: item.id,
      quantity: item.quantity,
    });
  },

  updateItem: async (itemId, quantity) => {
    if (USE_MOCK) return mockCartService.updateCartItem(itemId, quantity);
    return apiClient.put(API_ENDPOINTS.CART_UPDATE, { itemId, quantity });
  },

  removeItem: async (itemId) => {
    if (USE_MOCK) return mockCartService.removeFromCart(itemId);
    return apiClient.delete(API_ENDPOINTS.CART_REMOVE, { data: { itemId } });
  },

  clearCart: async () => {
    if (USE_MOCK) return mockCartService.clearCart();
    return apiClient.delete(API_ENDPOINTS.CART);
  },
};

export default cartService;
