import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import AddressAutocomplete from '../../locations/AddressAutocomplete';
import MapSelector from '../../locations/MapSelector';

const AddressStep = ({ formData, onChange, mapCenter, setMapCenter }) => {
  const [addressError, setAddressError] = useState('');
  
  // Handle address selection from autocomplete
  const handleAddressSelect = (selectedAddress) => {
    if (!selectedAddress) {
      setAddressError('Please select a valid address');
      return;
    }
    
    // Clear any previous errors
    setAddressError('');
    
    // Update form data with address information
    onChange({
      address: selectedAddress.formattedAddress,
      locality: selectedAddress.locality || '',
      city: selectedAddress.city || '',
      country: selectedAddress.country || '',
      latitude: selectedAddress.lat,
      longitude: selectedAddress.lng
    });
    
    // Update map center
    setMapCenter({
      lat: selectedAddress.lat,
      lng: selectedAddress.lng
    });
  };
  
  // Handle marker drag on map
  const handleMarkerDrag = (newPosition) => {
    onChange({
      latitude: newPosition.lat,
      longitude: newPosition.lng
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Where is <span className="text-indigo-600">{formData.name}</span> located?
        </h2>
        <p className="mt-2 text-gray-600">
          Search for an address or drop a pin on the map
        </p>
      </div>
      
      {/* Address Search */}
      <div className="space-y-2">
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <AddressAutocomplete
            onAddressSelect={handleAddressSelect}
            defaultValue={formData.address}
            error={!!addressError}
          />
        </div>
        {addressError && (
          <p className="mt-1 text-sm text-red-600">{addressError}</p>
        )}
        <p className="text-xs text-gray-500">
            We do not need your exact address, just a general location or a place nearby will do. 
        </p>
      </div>
      
      {/* Map Display */}
      <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 h-64 md:h-80">
        <MapSelector
          center={mapCenter}
          onMarkerDrag={handleMarkerDrag}
          hasCoordinates={!!(formData.latitude && formData.longitude)}
        />
      </div>
      
      {/* Selected Location Info */}
      {formData.address && (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <MapPin className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-indigo-800">Selected Location</h3>
              <p className="mt-1 text-sm text-indigo-700">{formData.address}</p>
              {formData.city && formData.country && (
                <p className="text-xs text-indigo-600 mt-1">
                  {formData.city}, {formData.country}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressStep;