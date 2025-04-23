import axios from 'axios';
import { getAuthToken } from '../utils/storage';

// Create axios instance with base URL from environment variable or default
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token to request if it exists
    const token = await getAuthToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // For token refresh implementation:
      // if (error.response.data.message === 'Token expired') {
      //   try {
      //     // Refresh token logic would go here
      //     // Then retry original request
      //     return apiClient(originalRequest);
      //   } catch (refreshError) {
      //     // Handle refresh failure
      //   }
      // }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;