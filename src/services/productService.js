// Product Service
// ============================================================
// Handles all product-related API calls

import apiClient from './api/apiClient';
import { API_ENDPOINTS } from './api/baseURL';

export const productService = {
  // Fetch all products with optional filters
  fetchProducts: (filters = {}) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS, { params: filters }),

  // Fetch product by ID
  fetchProductById: (id) =>
    apiClient.get(API_ENDPOINTS.PRODUCT_BY_ID(id)),

  // Fetch all categories
  fetchCategories: () =>
    apiClient.get(API_ENDPOINTS.CATEGORIES),

  // Fetch products by category
  fetchProductsByCategory: (categoryId) =>
    apiClient.get(API_ENDPOINTS.CATEGORY_PRODUCTS(categoryId)),

  // Search products
  searchProducts: (query) =>
    apiClient.get(API_ENDPOINTS.PRODUCTS, { params: { search: query } }),
};

export default productService;
