import React from 'react';
import { MapPinIcon, HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

/**
 * Component to display location details
 * Can be used in cards, lists, and detail pages
 */
const LocationDetails = ({ location, isCompact = false }) => {
  if (!location) return null;
  
  // Determine icon based on location name
  const getLocationIcon = () => {
    const name = location.name?.toLowerCase() || '';
    
    if (name.includes('home') || name.includes('house') || name.includes('apartment')) {
      return <HomeIcon className="h-5 w-5 text-blue-500" />;
    } else if (name.includes('office') || name.includes('work') || name.includes('business')) {
      return <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />;
    }
    
    return <MapPinIcon className="h-5 w-5 text-blue-500" />;
  };
  
  // Format full address if not provided
  const fullAddress = location.full_address || 
    [location.address, location.locality, location.city, location.country]
      .filter(Boolean)
      .join(', ');
  
  // Compact view (for cards and lists)
  if (isCompact) {
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getLocationIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {location.name}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {fullAddress}
          </p>
        </div>
      </div>
    );
  }
  
  // Full view (for detail pages)
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            {getLocationIcon()}
          </div>
          <div className="ml-5 w-0 flex-1">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {location.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {fullAddress}
            </p>
          </div>
        </div>
        
        <div className="mt-5 border-t border-gray-200 pt-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            {location.locality && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Neighborhood/Locality</dt>
                <dd className="mt-1 text-sm text-gray-900">{location.locality}</dd>
              </div>
            )}
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.city}</dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{location.country}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {location.latitude}, {location.longitude}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default LocationDetails;