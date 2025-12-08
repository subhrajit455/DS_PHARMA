// Product Service
// ============================================================
// Handles all product-related API calls

import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";
import { mockProductService } from "./mockProductService";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true; // Default to true for now

export const productService = {
  // Fetch all products with optional filters
  getProducts: async (filters = {}) => {
    if (USE_MOCK) return mockProductService.getProducts(filters);
    return apiClient.get(API_ENDPOINTS.PRODUCTS, { params: filters });
  },

  // Fetch product by ID
  getProductById: async (id) => {
    if (USE_MOCK) return mockProductService.getProductById(id);
    return apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },

  // Fetch all categories
  getCategories: async () => {
    if (USE_MOCK) return mockProductService.getCategories();
    return apiClient.get(API_ENDPOINTS.CATEGORIES);
  },

  // Fetch products by category
  getProductsByCategory: async (categoryId) => {
    if (USE_MOCK)
      return mockProductService.getProducts({ category: categoryId });
    return apiClient.get(API_ENDPOINTS.CATEGORY_PRODUCTS(categoryId));
  },

  // Search products
  searchProducts: async (query) => {
    if (USE_MOCK) return mockProductService.getProducts({ search: query });
    return apiClient.get(API_ENDPOINTS.PRODUCTS, { params: { search: query } });
  },

  // Get Related Products
  getRelatedProducts: async (categoryId, currentProductId) => {
    if (USE_MOCK)
      return mockProductService.getRelatedProducts(
        categoryId,
        currentProductId
      );
    return apiClient.get(API_ENDPOINTS.PRODUCTS, {
      params: { category: categoryId, exclude: currentProductId, limit: 4 },
    });
  },

  // Alias for hooks that use different naming
  fetchProductById: async (id) => {
    if (USE_MOCK) return mockProductService.getProductById(id);
    return apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },
};

export default productService;
