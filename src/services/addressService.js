// Address Service - Frontend-Only Mode
// ============================================================
// TODO: Replace with real API calls when backend is ready
// Currently using localStorage-based mock implementation

import { MOCK_ADDRESSES, ADDRESS_STORAGE_KEY } from "@/data/addressData";
// import apiClient from "./api/apiClient";
// import { API_ENDPOINTS } from "./api/baseURL";

// Set to false when backend is ready
const USE_MOCK_DATA = true;

// Helper: Get addresses from localStorage or use mock data
const getStoredAddresses = () => {
  try {
    const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data on first load
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(MOCK_ADDRESSES));
    return MOCK_ADDRESSES;
  } catch (error) {
    console.error("Error reading addresses from localStorage:", error);
    return MOCK_ADDRESSES;
  }
};

// Helper: Save addresses to localStorage
const saveAddresses = (addresses) => {
  try {
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  } catch (error) {
    console.error("Error saving addresses to localStorage:", error);
  }
};

// Simulate async API call delay for realistic UX
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const addressService = {
  // Fetch all addresses
  fetchAddresses: async () => {
    if (USE_MOCK_DATA) {
      await delay(300); // Simulate network delay
      const addresses = getStoredAddresses();
      return { data: addresses }; // Match API response format
    }
    // TODO: Uncomment when backend is ready
    // return apiClient.get(API_ENDPOINTS.ADDRESSES);
    throw new Error("Backend API not configured");
  },

  // Fetch address by ID
  fetchAddressById: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(200);
      const addresses = getStoredAddresses();
      const address = addresses.find((addr) => addr.id === id);
      return { data: address || null };
    }
    // TODO: Uncomment when backend is ready
    // return apiClient.get(API_ENDPOINTS.ADDRESS_DETAILS(id));
    throw new Error("Backend API not configured");
  },

  // Add new address
  addAddress: async (addressData) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let addresses = getStoredAddresses();

      // If new address is being set as default, remove default from all others
      if (addressData.isDefault === true) {
        addresses = addresses.map((addr) => ({
          ...addr,
          isDefault: false,
        }));
      }

      const newAddress = {
        ...addressData,
        id: `addr-${Date.now()}`, // Generate unique ID
      };
      const updated = [...addresses, newAddress];
      saveAddresses(updated);
      return { data: newAddress };
    }
    // TODO: Uncomment when backend is ready
    // return apiClient.post(API_ENDPOINTS.ADD_ADDRESS, addressData);
    throw new Error("Backend API not configured");
  },

  // Update address
  updateAddress: async (id, addressData) => {
    if (USE_MOCK_DATA) {
      await delay(400);
      let addresses = getStoredAddresses();

      // If setting as default, remove default from ALL other addresses first
      if (addressData.isDefault === true) {
        addresses = addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id ? true : false,
        }));
      }

      // Then apply the update to the target address
      const updated = addresses.map((addr) =>
        addr.id === id ? { ...addr, ...addressData, id } : addr
      );

      saveAddresses(updated);
      const updatedAddress = updated.find((addr) => addr.id === id);
      return { data: updatedAddress };
    }
    // TODO: Uncomment when backend is ready
    // return apiClient.put(API_ENDPOINTS.UPDATE_ADDRESS(id), addressData);
    throw new Error("Backend API not configured");
  },

  // Delete address
  deleteAddress: async (id) => {
    if (USE_MOCK_DATA) {
      await delay(300);
      const addresses = getStoredAddresses();
      const updated = addresses.filter((addr) => addr.id !== id);
      saveAddresses(updated);
      return { data: { success: true, id } };
    }
    // TODO: Uncomment when backend is ready
    // return apiClient.delete(API_ENDPOINTS.DELETE_ADDRESS(id));
    throw new Error("Backend API not configured");
  },
};

export default addressService;
