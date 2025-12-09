import apiClient from "../api/axios.config";
import { ENDPOINTS } from "../api/endpoints";
import mockApi from "../api/mockApi";

// Use mock service for local development
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true" || true;

export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    if (USE_MOCK) {
      return mockApi.login(credentials);
    }
    return apiClient.post(ENDPOINTS.LOGIN, credentials);
  },

  /**
   * Register new user
   */
  signup: async (userData) => {
    if (USE_MOCK) {
      // mockApi doesn't have signup yet, but hooks handle it directly
      // This is a fallback - hooks should use useSignup which talks to store directly
      console.warn(
        "authService.signup called - hooks should use useSignup directly"
      );
      return { data: { success: true, message: "Use useSignup hook instead" } };
    }
    return apiClient.post(ENDPOINTS.SIGNUP, userData);
  },

  /**
   * Logout user
   */
  logout: async () => {
    if (USE_MOCK) {
      // Logout is handled by useDataStore directly
      return { data: { success: true } };
    }
    return apiClient.post(ENDPOINTS.LOGOUT);
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return apiClient.post(ENDPOINTS.FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token, newPassword) => {
    return apiClient.post(ENDPOINTS.RESET_PASSWORD, { token, newPassword });
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken) => {
    return apiClient.post(ENDPOINTS.REFRESH_TOKEN, { refreshToken });
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    if (USE_MOCK) {
      // Get current user from localStorage (useDataStore persistence)
      const storeData = localStorage.getItem("ds-pharma-store");
      if (storeData) {
        const parsed = JSON.parse(storeData);
        if (parsed.state?.currentUser) {
          return { data: parsed.state.currentUser };
        }
      }
      return { data: null };
    }
    return apiClient.get(ENDPOINTS.USER_PROFILE);
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      // In mock mode, profile updates should go through useDataStore
      return { data: { ...profileData, success: true } };
    }
    return apiClient.put(ENDPOINTS.UPDATE_PROFILE, profileData);
  },
};
