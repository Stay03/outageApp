import React, { useState, useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const libraries = ['places'];

const AddressAutocomplete = ({ onAddressSelect, defaultValue = '', error = false }) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps script with Places library
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAeS-lrr37P6tmrqYd4eu54dm6NKn2-wqE',
    libraries
  });

  // Initialize Google Autocomplete when the script is loaded
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Create the autocomplete instance with broader types
    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      // Remove the types restriction or use ['establishment', 'geocode'] to include both places and addresses
      // types: ['address'], // Removing this restriction
      fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id', 'types'],
      // Restrition to Ghana and Nigeria
      componentRestrictions: { country: ['gh', 'ng'] },
    });

    // Add listener for place changes
    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);

    // Prevent form submission on Enter key (which would select the first autocomplete option)
    inputRef.current.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') e.preventDefault();
    });

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onAddressSelect]);

  // Update input value when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setInputValue(defaultValue);
    }
  }, [defaultValue]);

  // Handle place selection
  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry) return;

    // Format the selected address/place data
    const placeData = {
      formattedAddress: place.formatted_address || place.name,
      name: place.name,
      placeId: place.place_id,
      types: place.types,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      locality: '',
      city: '',
      country: ''
    };

    // Extract address components if available
    if (place.address_components) {
      place.address_components.forEach(component => {
        const types = component.types;

        if (types.includes('sublocality') || types.includes('neighborhood') )  {
          placeData.locality = component.long_name;
        }

        if (types.includes('locality')) {
          placeData.city = component.long_name;
        }

        if (types.includes('country')) {
          placeData.country = component.long_name;
        }
      });
    }

    // Update input with formatted address or place name
    setInputValue(place.formatted_address || place.name);

    // Call the callback with the parsed place data
    onAddressSelect(placeData);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle input blur
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="relative">
      <label htmlFor="address-autocomplete" className="block text-sm font-medium text-gray-700 mb-1">
        Address
      </label>
      <div className="mt-1">
        <input
          ref={inputRef}
          type="text"
          id="address-autocomplete"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Enter address or place name"
          className={`
            block w-full px-4 py-3 rounded-lg
            transition-all duration-200
            border ${isFocused ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}
            ${error ? 'border-red-300 text-red-900 placeholder-red-300' : ''}
            focus:outline-none
          `}
          disabled={!isLoaded}
        />
      </div>

      {/* Loading or error indicator */}
      {!isLoaded && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {/* Error indicator */}
      {error && isLoaded && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
      )}

      {/* Load error message */}
      {loadError && (
        <p className="mt-2 text-sm text-red-600">
          Error loading place search. Please enter address manually.
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
