import React, { createContext, useState, useEffect } from 'react';
import { fetchLocations, createLocation, updateLocation, deleteLocation } from '../api/locations';
import { useAuth } from '../hooks/useAuth';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocations, setHasLocations] = useState(false);
  const [locationError, setLocationError] = useState(null);
  
  // Fetch locations when the user is authenticated
  useEffect(() => {
    const loadLocations = async () => {
      if (!isAuthenticated || authLoading) return;
      
      setIsLoading(true);
      setLocationError(null);
      
      try {
        const response = await fetchLocations();
        setLocations(response.data || []);
        setHasLocations((response.data || []).length > 0);
      } catch (error) {
        console.error('Error loading locations:', error);
        setLocationError('Failed to load locations');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, [isAuthenticated, authLoading]);
  
  const addLocation = async (locationData) => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      const response = await createLocation(locationData);
      const newLocation = response.location;
      
      setLocations(prev => [...prev, newLocation]);
      setHasLocations(true);
      
      return newLocation;
    } catch (error) {
      // Check if it's a duplicate location (409 Conflict)
      if (error.response?.status === 409) {
        // The API already returns the existing location
        const existingLocation = error.response.data.location;
        setLocations(prev => {
          if (!prev.some(loc => loc.id === existingLocation.id)) {
            return [...prev, existingLocation];
          }
          return prev;
        });
        setHasLocations(true);
        setLocationError('A location with these coordinates already exists');
        return existingLocation;
      }
      
      setLocationError(error.response?.data?.message || 'Failed to create location');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateLocationById = async (id, locationData) => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      const response = await updateLocation(id, locationData);
      const updatedLocation = response.location;
      
      setLocations(prev => 
        prev.map(location => 
          location.id === id ? updatedLocation : location
        )
      );
      
      return updatedLocation;
    } catch (error) {
      setLocationError(error.response?.data?.message || 'Failed to update location');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeLocation = async (id) => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      await deleteLocation(id);
      
      setLocations(prev => prev.filter(location => location.id !== id));
      setHasLocations(locations.length > 1); // Update hasLocations based on result
      
      return true;
    } catch (error) {
      setLocationError(error.response?.data?.message || 'Failed to delete location');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearLocationError = () => {
    setLocationError(null);
  };
  
  return (
    <LocationContext.Provider
      value={{
        locations,
        hasLocations,
        isLoading,
        locationError,
        addLocation,
        updateLocationById,
        removeLocation,
        clearLocationError
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;