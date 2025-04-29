import React, { useState, useEffect } from 'react';
import { AlertCircle, Info, CheckCircle, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';
import MapSelector from './MapSelector';

const LocationForm = ({ onSubmit, isLoading, error }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locality: '',
    city: '',
    country: '',
    latitude: null,
    longitude: null
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  
  // Map center state
  const [mapCenter, setMapCenter] = useState({
    lat: 5.57,
    lng: -0.26
  });

  // Location type suggestions
  const locationTypes = ['Home', 'Office', 'Hostel', 'Work', 'School', 'Gym'];
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please provide a name for this location';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required';
    } else if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Invalid latitude';
    }
    
    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required';
    } else if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Invalid longitude';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) : value
    }));
    setIsDirty(true);
  };
  
  // Handle address selection from autocomplete
  const handleAddressSelect = (selectedAddress) => {
    setFormData((prev) => ({
      ...prev,
      address: selectedAddress.formattedAddress,
      locality: selectedAddress.locality || '',
      city: selectedAddress.city || '',
      country: selectedAddress.country || '',
      latitude: selectedAddress.lat,
      longitude: selectedAddress.lng
    }));
    
    setMapCenter({
      lat: selectedAddress.lat,
      lng: selectedAddress.lng
    });
    
    setIsDirty(true);
    setIsAutofilled(true);
  };
  
  // Handle marker drag on map
  const handleMarkerDrag = (newPosition) => {
    setFormData((prev) => ({
      ...prev,
      latitude: newPosition.lat,
      longitude: newPosition.lng
    }));
    setIsDirty(true);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // Handle location type selection
  const handleLocationTypeSelect = (type) => {
    setFormData((prev) => ({
      ...prev,
      name: type
    }));
    setIsDirty(true);
  };
  
  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && isDirty;
  
  // Update map center when coordinates change
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMapCenter({
        lat: parseFloat(formData.latitude),
        lng: parseFloat(formData.longitude)
      });
    }
  }, [formData.latitude, formData.longitude]);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
        {/* Form Panel */}
        <div className="lg:col-span-2 p-6 md:p-8">
          <div className="flex items-center space-x-2 mb-6">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Add New Location</h2>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Location Name with Bubbles */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="What do you call this place?"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              
              {/* Quick Select Bubbles */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {locationTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleLocationTypeSelect(type)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        formData.name === type
                          ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Address with Google Autocomplete */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="mt-1">
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  defaultValue={formData.address}
                  error={!!errors.address}
                />
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your address or use the map to set your location
              </p>
            </div>
            
            {/* Collapsible Details Section (only shown after autofill) */}
            {isAutofilled && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide location details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show location details
                    </>
                  )}
                </button>
                
                {showDetails && (
                  <div className="mt-4 space-y-4">
                    {/* Locality/Neighborhood */}
                    <div>
                      <label htmlFor="locality" className="block text-sm font-medium text-gray-700">
                        Neighborhood/Locality
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="locality"
                          name="locality"
                          value={formData.locality}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    {/* City and Country - Side by side */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg ${
                              errors.city ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.city && (
                            <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg ${
                              errors.country ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.country && (
                            <p className="mt-2 text-sm text-red-600">{errors.country}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Coordinates - Side by side */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                          Latitude
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="number"
                            step="any"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude || ''}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg ${
                              errors.latitude ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.latitude && (
                            <p className="mt-2 text-sm text-red-600">{errors.latitude}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                          Longitude
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            step="any"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude || ''}
                            onChange={handleChange}
                            className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full px-4 py-3 sm:text-sm border-gray-300 rounded-lg ${
                              errors.longitude ? 'border-red-300' : ''
                            }`}
                          />
                          {errors.longitude && (
                            <p className="mt-2 text-sm text-red-600">{errors.longitude}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Coordinate helper text */}
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">
                  Drag the map marker to precisely adjust your location coordinates
                </p>
              </div>
            </div>
            
            {/* Submit button */}
            <div>
              <button
                onClick={handleSubmit}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isValid}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Location...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Location
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Map Panel */}
        <div className="lg:col-span-3 h-96 lg:h-auto">
          <div className="h-full w-full">
            <MapSelector
              center={mapCenter}
              onMarkerDrag={handleMarkerDrag}
              hasCoordinates={!!(formData.latitude && formData.longitude)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;