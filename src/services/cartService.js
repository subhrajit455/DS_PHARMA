// DEPRECATED: This service is largely redundant
// Cart operations should use useDataStore directly via mutation hooks
//
// Migration guide:
// OLD: cartService.addToCart()
// NEW: Use useAddToCart() hook which updates useDataStore directly
//
// OLD: cartService.getCart()
// NEW: const cart = useDataStore((state) => state.cart)

import apiClient from "@/services/api/apiClient";
import { API_ENDPOINTS } from "@/services/api/baseURL";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;

export const cartService = {
  getCart: async () => {
    if (USE_MOCK) {
      // Read from global store
      const storeData = localStorage.getItem("ds-pharma-store");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        return { data: parsed.state?.cart || [] };
      }
      return { data: [] };
    }
    return apiClient.get(API_ENDPOINTS.CART);
  },

  // All mutation methods deprecated - use hooks instead
  addToCart: async () => {
    console.warn("cartService.addToCart is deprecated - use useAddToCart hook");
    return { data: { message: "Use useAddToCart hook" } };
  },

  addItem: async () => {
    console.warn("cartService.addItem is deprecated - use useAddToCart hook");
    return { data: { message: "Use useAddToCart hook" } };
  },

  updateItem: async () => {
    console.warn(
      "cartService.updateItem is deprecated - use useUpdateCart hook"
    );
    return { data: { message: "Use useUpdateCart hook" } };
  },

  removeItem: async () => {
    console.warn(
      "cartService.removeItem is deprecated - use useRemoveFromCart hook"
    );
    return { data: { message: "Use useRemoveFromCart hook" } };
  },

  clearCart: async () => {
    console.warn(
      "cartService.clearCart is deprecated - use useDataStore clearCart action"
    );
    return { data: { message: "Use useDataStore clearCart" } };
  },
};

export default cartService;
