// Product Service
// ============================================================
// Handles all product-related API calls

import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";
import mockApi from "../api/mockApi";
import useDataStore from "../store/useDataStore";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true; // Default to true for now

export const productService = {
  // Fetch all products with optional filters
  getProducts: async (filters = {}) => {
    if (USE_MOCK) {
      const result = await mockApi.getProducts(filters);

      // Apply additional filters client-side if needed
      let products = result.data;

      if (filters.search) {
        const lowerSearch = filters.search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerSearch) ||
            p.genericName?.toLowerCase().includes(lowerSearch) ||
            p.category?.toLowerCase().includes(lowerSearch)
        );
      }

      if (filters.exclude) {
        products = products.filter((p) => p.id !== filters.exclude);
      }

      if (filters.limit) {
        products = products.slice(0, filters.limit);
      }

      return { data: products, total: products.length };
    }
    return apiClient.get(API_ENDPOINTS.PRODUCTS, { params: filters });
  },

  // Fetch product by ID
  getProductById: async (id) => {
    if (USE_MOCK) {
      const product = await mockApi.getProductById(id);
      return { data: product };
    }
    return apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  },

  // Fetch all categories
  getCategories: async () => {
    if (USE_MOCK) {
      const categories = useDataStore.getState().categories;
      return { data: categories };
    }
    return apiClient.get(API_ENDPOINTS.CATEGORIES);
  },

  // Fetch products by category
  getProductsByCategory: async (categoryId) => {
    if (USE_MOCK) {
      return productService.getProducts({ category: categoryId });
    }
    return apiClient.get(API_ENDPOINTS.CATEGORY_PRODUCTS(categoryId));
  },

  // Search products
  searchProducts: async (query) => {
    if (USE_MOCK) {
      return productService.getProducts({ search: query });
    }
    return apiClient.get(API_ENDPOINTS.PRODUCTS, { params: { search: query } });
  },

  // Get Related Products
  getRelatedProducts: async (categoryId, currentProductId) => {
    if (USE_MOCK) {
      return productService.getProducts({
        category: categoryId,
        exclude: currentProductId,
        limit: 4,
      });
    }
    return apiClient.get(API_ENDPOINTS.PRODUCTS, {
      params: { category: categoryId, exclude: currentProductId, limit: 4 },
    });
  },

  // Alias for hooks that use different naming
  fetchProductById: async (id) => {
    return productService.getProductById(id);
  },
};

export default productService;
