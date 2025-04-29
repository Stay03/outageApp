import apiClient from './axios';

/**
 * Fetch all locations for the current user
 * @param {Object} params Query parameters for filtering and pagination
 * @returns {Promise<Object>} Response with locations data and pagination
 */
export const fetchLocations = async (params = {}) => {
  try {
    const response = await apiClient.get('/locations', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch locations error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch a specific location by ID
 * @param {number} id Location ID
 * @returns {Promise<Object>} Location data
 */
export const fetchLocation = async (id) => {
  try {
    const response = await apiClient.get(`/locations/${id}`);
    return response.data.location;
  } catch (error) {
    console.error('Fetch location error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new location
 * @param {Object} locationData Location data to create
 * @returns {Promise<Object>} Created location data
 */
export const createLocation = async (locationData) => {
  try {
    const response = await apiClient.post('/locations', locationData);
    return response.data;
  } catch (error) {
    console.error('Create location error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing location
 * @param {number} id Location ID
 * @param {Object} locationData Updated location data
 * @returns {Promise<Object>} Updated location data
 */
export const updateLocation = async (id, locationData) => {
  try {
    const response = await apiClient.put(`/locations/${id}`, locationData);
    return response.data;
  } catch (error) {
    console.error('Update location error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a location
 * @param {number} id Location ID
 * @returns {Promise<Object>} Response data
 */
export const deleteLocation = async (id) => {
  try {
    const response = await apiClient.delete(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete location error:', error.response?.data || error.message);
    throw error;
  }
};