import { searchUrl } from "@/config/userApi";
import apiClient from "@/services/api/apiClient";
// import { API_ENDPOINTS } from "@/services/api/baseURL";
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
    limit = 50,
  } = {}) => {
    // Check cache first
    // const cachedResult = productService.getCachedSearchResults(query, filters, sort, page, limit);
    // if (cachedResult) {
    //    return cachedResult;
    // }

    // Map sort to sortBy and order
    let sortBy = "name";
    let order = 2;

    switch (sort) {
      case "price_low_to_high":
        sortBy = "price";
        order = 2;
        break;
      case "price_high_to_low":
        sortBy = "price";
        order = -1;
        break;
      case "newest":
        sortBy = "createdAt"; 
        order = -1;
        break;
      case "relevance":
      default:
        sortBy = "name";
        order = 1;
        break;
    }

    // Map stock: 1 for In Stock, 2 for All (as per user hint)
    const stock =  1 ;

    try {
      const response = await apiClient.get(`${searchUrl.searchProducts}`, {
        params: {
          query: query,
          page,
          limit,
          // sortBy,
          order,
          stock,
          // Include other filters if they exist, but exclude mapped ones to avoid duplication if necessary
          // ...filters, 
        },
      });

      // Return structured response with PROPER normalization
      const responseData = response.data?.data || response.data || {};
      
      // Fix: API returns products inside a products array within the data object
      const rawProducts = responseData.products || (Array.isArray(responseData) ? responseData : []);
      
      // CRITICAL FIX: Use productService normalization for consistency
      const normalizedProducts = Array.isArray(rawProducts)
        ? rawProducts.map(normalizeProduct).filter(Boolean)
        : [];

      const result = {
        data: {
          products: normalizedProducts,
          facets: responseData.facets || {},
          pagination: {
            page: Number(responseData.page) || page,
            limit: Number(responseData.limit) || limit,
            total: Number(responseData.totalProducts) || normalizedProducts.length,
            totalPages: Number(responseData.totalPages) || 1,
            hasMore: responseData.hasMore || false
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
      const response = await apiClient.get(`${searchUrl.searchProducts}`, {
        params: { query: query, limit: 25, stock: 1},
      });

      // Use normalization for suggestions too
      const responseData = response.data?.data || response.data || {};
      const rawData = responseData.products || (Array.isArray(responseData) ? responseData : []);
      
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