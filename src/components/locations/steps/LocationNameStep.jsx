import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

const LocationNameStep = ({ name, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  // Location type suggestions
  const locationTypes = ['Home', 'My Crib', 'Shop', 'Office', 'Hostel', 'Work', 'School', 'Gym'];
  
  // Handle input change
  const handleChange = (e) => {
    onChange({ name: e.target.value });
  };
  
  // Handle location type selection
  const handleLocationTypeSelect = (type) => {
    onChange({ name: type });
  };
  
  return (
    <div className="space-y-6">
        
      
      
      <div className="space-y-4 mt-6">
        {/* Location Name Input */}
        <div className="relative">
          <label htmlFor="location-name" className="block text-sm font-medium text-gray-700 mb-1">
            Location Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="location-name"
              name="name"
              value={name}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`
                block w-full px-4 py-3 rounded-lg
                transition-all duration-200
                border ${isFocused ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-300'}
                focus:outline-none
              `}
              placeholder="e.g. Home, Office, etc."
              autoFocus
            />
          </div>
        </div>
        
        {/* Quick Select Buttons */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Select
          </label>
          <div className="flex flex-wrap gap-2">
            {locationTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleLocationTypeSelect(type)}
                className={`
                  px-4 py-2 rounded-full text-sm 
                  transition-all duration-200
                  ${name === type
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'}
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-500 italic">
          After naming your location, we'll ask for its address
        </p>
      </div>
    </div>
  );
};

export default LocationNameStep;