import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { LibraryAddCheckIcon, MyLocationIcon } from '@heroicons/react/24/solid';

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'on' }]
    }
  ]
};

const MapSelector = ({ center, onMarkerDrag, hasCoordinates }) => {
  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAeS-lrr37P6tmrqYd4eu54dm6NKn2-wqE',
    libraries: ['places']
  });
  
  // State for marker position
  const [markerPosition, setMarkerPosition] = useState(center);
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false);
  
  // Update marker position when center prop changes
  useEffect(() => {
    if (center.lat && center.lng) {
      setMarkerPosition(center);
    }
  }, [center]);
  
  // Handle marker drag end
  const handleMarkerDragEnd = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkerPosition(newPosition);
    onMarkerDrag(newPosition);
  }, [onMarkerDrag]);
  
  // Handle map click to place marker
  const handleMapClick = useCallback((event) => {
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setMarkerPosition(newPosition);
    onMarkerDrag(newPosition);
  }, [onMarkerDrag]);
  
  // Get user's current location
  const handleGetCurrentLocation = useCallback(() => {
    setIsGeolocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMarkerPosition(pos);
          onMarkerDrag(pos);
          setIsGeolocationLoading(false);
        },
        (error) => {
          console.error('Error fetching geolocation:', error);
          setIsGeolocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsGeolocationLoading(false);
    }
  }, [onMarkerDrag]);
  
  // If the map hasn't loaded yet or there's a load error
  if (loadError) return <div className="h-full flex items-center justify-center">Error loading maps</div>;
  if (!isLoaded) return <div className="h-full flex items-center justify-center">Loading maps...</div>;
  
  return (
    <div className="relative h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition}
        zoom={14}
        options={mapOptions}
        onClick={handleMapClick}
      >
        {/* Render marker only if coordinates exist */}
        {hasCoordinates && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
            animation={window.google.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
      
      {/* Current location button */}
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isGeolocationLoading}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          title="Use my current location"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 ${isGeolocationLoading ? 'text-gray-400 animate-pulse' : 'text-blue-500'}`} 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Placeholder when no location is selected */}
      {!hasCoordinates && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-center max-w-sm">
            <MapPinIcon className="h-12 w-12 text-blue-500 mx-auto" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Select a Location</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click on the map or use the search box to choose your location.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSelector;