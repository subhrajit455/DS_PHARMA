import apiClient from "./api/apiClient";
import { API_BASE_URL } from "./api/baseURL";

const customerService = {
  /**
   * Get all customers/parties with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 25)
   * @param {string} params.query - Search query
   * @param {string} params.sortBy - Sort field (default: 'name')
   * @param {number} params.order - Sort order (1 for asc, -1 for desc)
   * @param {number} params.is_deleted - Filter by deleted status (0 for active)
   * @returns {Promise<Object>} Paginated customer data
   */
  getAllCustomers: async (params = {}) => {
    const defaultParams = {
      page: 1,
      limit: 25,
      query: "",
      sortBy: "name",
      order: 1,
      is_deleted: 0,
      ...params,
    };

    const queryString = new URLSearchParams(defaultParams).toString();
    const response = await apiClient.get(`/api/v1/parties?${queryString}`);
    return response.data;
  },

  /**
   * Get customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Customer data
   */
  getCustomerById: async (id) => {
    const response = await apiClient.get(`/api/v1/parties/${id}`);
    return response.data;
  },

  /**
   * Create new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise<Object>} Created customer data
   */
  createCustomer: async (customerData) => {
    const response = await apiClient.post("/api/v1/parties", customerData);
    return response.data;
  },

  /**
   * Update customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise<Object>} Updated customer data
   */
  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/api/v1/parties/${id}`, customerData);
    return response.data;
  },

  /**
   * Delete customer (soft delete)
   * @param {string} id - Customer ID
   * @returns {Promise<Object>} Deletion response
   */
  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/api/v1/parties/${id}`);
    return response.data;
  },

  /**
   * Search customers
   * @param {string} query - Search query
   * @param {Object} additionalParams - Additional search parameters
   * @returns {Promise<Array>} Search results
   */
  searchCustomers: async (query, additionalParams = {}) => {
    const params = {
      query,
      page: 1,
      limit: 50,
      ...additionalParams,
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/api/v1/parties?${queryString}`);
    return response.data;
  },
};

export default customerService;
