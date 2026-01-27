import apiClient from "@/services/api/apiClient";
import { API_ENDPOINTS } from "@/services/api/baseURL";
import { normalizeProduct } from "@/services/productService"; // CRITICAL FIX: Use proper normalization
import productService from "@/services/productService"; // For caching utilities

const searchService = {
  /**
   * Search products using user-facing backend API
   * @param {Object} params - { query, filters, sort, page, limit }
   * @returns {Promise} Search results with products and facets
   */
  searchProducts: async ({
    query = "",
    filters = {},
    sort = "relevance",
    page = 1,
    limit = 12,
  } = {}) => {
    // Check cache first
    const cachedResult = productService.getCachedSearchResults(query, filters, sort, page, limit);
    if (cachedResult) {
      return cachedResult;
    }
    
    try {
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_USER_SEARCH, {
        params: {
          search: query,
          page,
          limit,
          sort,
          ...filters,
        },
      });

      // Return structured response with PROPER normalization
      const rawProducts = response.data?.data || response.data || [];
      
      // CRITICAL FIX: Use productService normalization for consistency
      const normalizedProducts = Array.isArray(rawProducts)
        ? rawProducts.map(normalizeProduct).filter(Boolean)
        : [];

      const result = {
        data: {
          products: normalizedProducts,
          facets: response.data?.facets || {},
          pagination: response.data?.pagination || {
            page,
            limit,
            total: rawProducts.length,
            totalPages: 1,
          },
        },
      };
      
      // Cache the result
      productService.cacheSearchResults(query, filters, sort, page, limit, result);
      
      return result;
    } catch (error) {
      // Check if it's a cancellation error - don't log these
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        // Silent cancellation - do not treat as error
        return {
          data: {
            products: [],
            facets: {},
            pagination: { page: 1, limit, total: 0, totalPages: 0 },
          },
        };
      }
      
      console.error("Search products failed:", error);
      // Return empty results instead of throwing to prevent UI breaks
      return {
        data: {
          products: [],
          facets: {},
          pagination: { page: 1, limit, total: 0, totalPages: 0 },
        },
      };
    }
  },

  /**
   * Get search suggestions (for autocomplete)
   * @param {string} query - Search query
   * @returns {Promise} Suggestion results
   */
  getSuggestions: async (query) => {
    try {
      // Use search endpoint with lower limit for suggestions
      const response = await apiClient.get(API_ENDPOINTS.PRODUCT_USER_SEARCH, {
        params: { search: query, limit: 5 },
      });

      // Use normalization for suggestions too
      const rawData = response.data?.data || response.data || [];
      return Array.isArray(rawData)
        ? rawData.map(normalizeProduct).filter(Boolean)
        : [];
    } catch (error) {
      // Check if it's a cancellation error - don't log these
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        // Silent cancellation - return empty
        return [];
      }
      
      console.error("Get suggestions failed:", error);
      return [];
    }
  },
};

export default searchService;
