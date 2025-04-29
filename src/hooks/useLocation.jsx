import { useContext } from 'react';
import { LocationContext } from '../context/LocationContext';

/**
 * Custom hook to access location context
 * @returns {Object} Location methods and state
 */
export const useLocation = () => {
  const context = useContext(LocationContext);
  
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
};

export default useLocation;