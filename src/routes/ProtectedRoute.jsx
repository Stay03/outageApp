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