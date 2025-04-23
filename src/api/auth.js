import apiClient from './axios';

/**
 * Register a new user
 * @param {Object} userData User registration data
 * @returns {Promise<Object>} Registration response data
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials User credentials
 * @param {Boolean} logoutOthers Whether to invalidate other sessions
 * @returns {Promise<Object>} Login response data
 */
export const loginUser = async ({ email, password, logoutOthers = false }) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
      logout_others: logoutOthers
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout response data
 */
export const logoutUser = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch current user data
 * @returns {Promise<Object>} User data
 */
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/user');
    return response.data.user;
  } catch (error) {
    console.error('Fetch user error:', error.response?.data || error.message);
    throw error;
  }
};