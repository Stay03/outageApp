import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocation as useLocationContext } from '../hooks/useLocation';

/**
 * Route protection that checks if user has locations
 * Redirects to add location page if the user doesn't have any locations
 */
const LocationRoute = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasLocations, isLoading: locationLoading } = useLocationContext();
  
  // Show loading state while checking authentication and location status
  if (authLoading || locationLoading) {
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
  
  // Redirect to add location page if no locations exist
  if (!hasLocations) {
    return <Navigate to="/locations/add" replace />;
  }
  
  // Render child routes if authenticated and has locations
  return <Outlet />;
};

export default LocationRoute;