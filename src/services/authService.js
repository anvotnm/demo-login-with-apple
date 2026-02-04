import apiClient from "../config/api";

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login with Apple ID Token
   * @param {Object} payload - Apple authentication payload
   * @param {string} payload.id_token - Apple ID token
   * @param {string} [payload.code] - Authorization code (optional)
   * @param {Object} [payload.user] - User info (only on first sign-in)
   * @returns {Promise<Object>} User data and tokens
   */
  async loginWithApple(payload) {
    try {
      const response = await apiClient.post(
        "/auth-customer/apple/token",
        payload,
      );

      // Save tokens to localStorage
      if (response.data.access_token) {
        localStorage.setItem("access_token", response.data.access_token);
      }
      if (response.data.refresh_token) {
        localStorage.setItem("refresh_token", response.data.refresh_token);
      }

      // Save user info
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      console.error("Apple login failed:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || "An error occurred",
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: "No response from server. Please check your connection.",
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || "An unexpected error occurred",
        status: -1,
      };
    }
  }
}

export default new AuthService();
