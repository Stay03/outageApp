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