import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOnboarding } from '../hooks/useOnboarding';

/**
 * A wrapper component for routes that should only be accessible
 * after the onboarding process has been completed
 */
const ProtectedRoute = () => {
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  
  // Show loading state or spinner while checking status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Render child routes if onboarding is completed
  return <Outlet />;
};

export default ProtectedRoute;