# Codebase Documentation

{
  "Extraction Date": "2025-04-23 18:52:43",
  "Include Paths": [
    "src/context/AuthContext.jsx",
    "src/hooks/useAuth.jsx",
    "src/routes/AuthRoute.jsx",
    "src/routes/ProtectedRoute.jsx",
    "src/utils/storage.js",
    "src/api/axios.js",
    "src/api/auth.js",
    "src/App.js"
  ]
}

### src/context/AuthContext.jsx
```
import React, { createContext, useState, useEffect } from 'react';
import { getAuthToken, saveAuthToken, clearAllStorage } from '../utils/storage';
import apiClient from '../api/axios';
import { loginUser, registerUser, fetchCurrentUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Check for existing token on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedToken = await getAuthToken();
        
        if (storedToken) {
          // Validate token by fetching user data
          const userData = await fetchCurrentUser();
          setCurrentUser(userData);
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // Invalid or expired token
        await logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);
  
  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await loginUser({ email, password });
      const { user, token } = response;
      
      // Store token
      await saveAuthToken(token);
      
      // Update state
      setCurrentUser(user);
      setToken(token);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const response = await registerUser(userData);
      const { user, token } = response;
      
      // Store token
      await saveAuthToken(token);
      
      // Update state
      setCurrentUser(user);
      setToken(token);
      setIsAuthenticated(true);
      
      return user;
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear all storage
      await clearAllStorage();
      
      // Reset state
      setCurrentUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateUserProfile = (userData) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };
  
  const clearError = () => {
    setAuthError(null);
  };
  
  return (
    <AuthContext.Provider 
      value={{ 
        currentUser,
        isAuthenticated,
        isLoading,
        authError,
        login,
        register,
        logout,
        updateUserProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
```

### src/hooks/useAuth.jsx
```
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication methods and state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;
```

### src/routes/AuthRoute.jsx
```
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Route protection for unauthenticated users
 * Redirects to login if the user is not authenticated
 */
const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default AuthRoute;
```

### src/routes/ProtectedRoute.jsx
```
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';
import { useAuth } from '../hooks/useAuth';

/**
 * Route protection for authenticated & onboarded users
 * Redirects based on onboarding and authentication status
 */
const ProtectedRoute = () => {
  const { hasCompletedOnboarding, isLoading: onboardingLoading } = useOnboarding();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Show loading state while checking status
  if (onboardingLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Render child routes if both conditions are met
  return <Outlet />;
};

export default ProtectedRoute;
```

### src/utils/storage.js
```
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
```

### src/api/axios.js
```
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
```

### src/api/auth.js
```
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
```

### src/App.js
```
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoute from './routes/AuthRoute';
import OnboardingPage from './pages/onboarding/OnboardingPage';

// Import auth components
import AuthPage from './pages/auth/AuthPage';

// Import main app components (to be implemented later)
const Dashboard = () => <div>Dashboard (placeholder)</div>;
const OutagesPage = () => <div>Outages (placeholder)</div>;
const LocationsPage = () => <div>Locations (placeholder)</div>;

/**
 * Main application component
 * Sets up routing and context providers
 */
function App() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Routes that require authentication */}
            <Route element={<AuthRoute />}>
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/outages" element={<OutagesPage />} />
                <Route path="/locations" element={<LocationsPage />} />
              </Route>
            </Route>
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </OnboardingProvider>
  );
}

export default App;
```

