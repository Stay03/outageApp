/**
 * Google Maps API Utilities
 * Helper functions for Google Maps and Places API integration
 */

// Google Maps API key - should be moved to environment variables in production
export const GOOGLE_MAPS_API_KEY = 'AIzaSyAeS-lrr37P6tmrqYd4eu54dm6NKn2-wqE';

// Libraries to load with Google Maps
export const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry', 'drawing'];

/**
 * Extract address components from Google Places result
 * 
 * @param {Object} place - Google Places API place result
 * @returns {Object} Structured address data
 */
export const extractAddressComponents = (place) => {
  if (!place || !place.address_components) {
    return {};
  }
  
  const addressData = {
    streetNumber: '',
    streetName: '',
    neighborhood: '',
    locality: '',
    city: '',
    county: '',
    state: '',
    stateCode: '',
    postalCode: '',
    country: '',
    countryCode: '',
    formattedAddress: place.formatted_address || '',
  };
  
  // Map place address components to our structured format
  place.address_components.forEach(component => {
    const types = component.types;
    
    if (types.includes('street_number')) {
      addressData.streetNumber = component.long_name;
    }
    
    if (types.includes('route')) {
      addressData.streetName = component.long_name;
    }
    
    if (types.includes('neighborhood')) {
      addressData.neighborhood = component.long_name;
    }
    
    if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
      addressData.locality = component.long_name;
    }
    
    if (types.includes('locality')) {
      addressData.city = component.long_name;
    }
    
    if (types.includes('administrative_area_level_2')) {
      addressData.county = component.long_name;
    }
    
    if (types.includes('administrative_area_level_1')) {
      addressData.state = component.long_name;
      addressData.stateCode = component.short_name;
    }
    
    if (types.includes('postal_code')) {
      addressData.postalCode = component.long_name;
    }
    
    if (types.includes('country')) {
      addressData.country = component.long_name;
      addressData.countryCode = component.short_name;
    }
  });
  
  return addressData;
};

/**
 * Geocode an address to coordinates using Google Maps Geocoding API
 * 
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number}>} Coordinates
 */
export const geocodeAddress = async (address) => {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API not loaded');
  }
  
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          placeId: results[0].place_id,
          formattedAddress: results[0].formatted_address,
          ...extractAddressComponents(results[0])
        });
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Reverse geocode coordinates to an address using Google Maps Geocoding API
 * 
 * @param {Object} latLng - {lat, lng} coordinates
 * @returns {Promise<Object>} Address data
 */
export const reverseGeocode = async (latLng) => {
  if (!window.google || !window.google.maps) {
    throw new Error('Google Maps API not loaded');
  }
  
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve({
          formattedAddress: results[0].formatted_address,
          placeId: results[0].place_id,
          ...extractAddressComponents(results[0]),
          lat: latLng.lat,
          lng: latLng.lng
        });
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
};

/**
 * Initialize a Google Places Autocomplete instance
 * 
 * @param {HTMLInputElement} inputElement - DOM input element
 * @param {Object} options - Autocomplete options
 * @returns {google.maps.places.Autocomplete} Autocomplete instance
 */
export const initPlacesAutocomplete = (inputElement, options = {}) => {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    throw new Error('Google Maps Places API not loaded');
  }
  
  const defaultOptions = {
    types: ['address'],
    fields: [
      'address_components',
      'formatted_address',
      'geometry',
      'name',
      'place_id',
      'plus_code',
      'vicinity'
    ]
  };
  
  return new window.google.maps.places.Autocomplete(
    inputElement,
    { ...defaultOptions, ...options }
  );
};

export default {
  GOOGLE_MAPS_API_KEY,
  GOOGLE_MAPS_LIBRARIES,
  extractAddressComponents,
  geocodeAddress,
  reverseGeocode,
  initPlacesAutocomplete
};