/**
 * Storage utility functions for the Power Outage Tracker app
 * Handles saving and retrieving application state from localStorage
 */

// Keys for local storage
export const STORAGE_KEYS = {
    ONBOARDING_COMPLETED: 'pot_onboarding_completed',
    AUTH_TOKEN: 'pot_auth_token',
    USER_DATA: 'pot_user_data'
  };
  
  /**
   * Save onboarding completion status to local storage
   * @param {boolean} completed - Whether onboarding has been completed
   * @returns {Promise<boolean>} Success status
   */
  export const saveOnboardingStatus = async (completed) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
      return true;
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      return false;
    }
  };
  
  /**
   * Get onboarding completion status from local storage
   * @returns {Promise<boolean>} Whether onboarding has been completed
   */
  export const getOnboardingStatus = async () => {
    try {
      const status = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Error retrieving onboarding status:', error);
      return false;
    }
  };
  
  /**
   * Save authentication token to local storage
   * @param {string} token - The authentication token
   * @returns {Promise<boolean>} Success status
   */
  export const saveAuthToken = async (token) => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving auth token:', error);
      return false;
    }
  };
  
  /**
   * Get authentication token from local storage
   * @returns {Promise<string|null>} The stored token or null
   */
  export const getAuthToken = async () => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  };
  
  /**
   * Clear all app data from local storage
   * @returns {Promise<boolean>} Success status
   */
  export const clearAllStorage = async () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  };