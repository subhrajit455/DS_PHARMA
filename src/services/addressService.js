import apiClient from "./api/apiClient";
import { API_ENDPOINTS } from "./api/baseURL";

export const addressService = {
  // Fetch all addresses
  fetchAddresses: () => apiClient.get(API_ENDPOINTS.ADDRESSES),

  // Fetch address by ID
  fetchAddressById: (id) => apiClient.get(API_ENDPOINTS.ADDRESS_DETAILS(id)),

  // Add new address
  addAddress: (addressData) =>
    apiClient.post(API_ENDPOINTS.ADD_ADDRESS, addressData),

  // Update address
  updateAddress: (id, addressData) =>
    apiClient.put(API_ENDPOINTS.UPDATE_ADDRESS(id), addressData),

  // Delete address
  deleteAddress: (id) => apiClient.delete(API_ENDPOINTS.DELETE_ADDRESS(id)),
};

export default addressService;
