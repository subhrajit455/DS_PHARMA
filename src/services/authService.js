import apiClient from "../api/axios.config";
import { ENDPOINTS } from "../api/endpoints";
import { mockAuthService } from "./mockAuthService";

// Use mock service for local development
const USE_MOCK = true;

export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    if (USE_MOCK) {
      return mockAuthService.login(credentials);
    }
    return apiClient.post(ENDPOINTS.LOGIN, credentials);
  },

  /**
   * Register new user
   */
  signup: async (userData) => {
    if (USE_MOCK) {
      return mockAuthService.signup(userData);
    }
    return apiClient.post(ENDPOINTS.SIGNUP, userData);
  },

  /**
   * Logout user
   */
  logout: async () => {
    if (USE_MOCK) {
      return mockAuthService.logout();
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
      // Get token from store if needed
      const token = localStorage.getItem("ds-pharma-auth");
      if (token) {
        const auth = JSON.parse(token);
        return mockAuthService.getProfile(auth.state?.token);
      }
    }
    return apiClient.get(ENDPOINTS.USER_PROFILE);
  },

  /**
   * Update user profile
   */
  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      const token = localStorage.getItem("ds-pharma-auth");
      if (token) {
        const auth = JSON.parse(token);
        return mockAuthService.updateProfile(profileData, auth.state?.token);
      }
    }
    return apiClient.put(ENDPOINTS.UPDATE_PROFILE, profileData);
  },
};
