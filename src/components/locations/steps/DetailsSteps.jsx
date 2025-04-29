import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { CheckCircle, Info } from 'lucide-react';

const DetailsStep = ({ formData }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Location</h2>
        <p className="mt-2 text-gray-600">
          Confirm these details before saving
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
        <div className="flex items-start">
          <MapPinIcon className="h-6 w-6 text-indigo-500" />
          <div className="ml-3">
            <h3 className="text-lg font-medium text-indigo-900">{formData.name}</h3>
            <p className="text-sm text-indigo-700 mt-1">{formData.address}</p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="ml-1 text-xs text-green-600">Location verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Display-only Location Info */}
      <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 flex items-center mb-3">
          <Info className="h-4 w-4 mr-1 text-indigo-500" />
          Location Details
        </h3>

        <div className="text-sm space-y-2">
          <div>
            <span className="font-semibold text-gray-800">Neighborhood/Locality:</span>{' '}
            <span className="text-gray-600">{formData.locality || '—'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-800">City:</span>{' '}
            <span className="text-gray-600">{formData.city || '—'}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Country:</span>{' '}
            <span className="text-gray-600">{formData.country || '—'}</span>
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="flex items-start mt-4 pt-4 border-t border-gray-100">
        <Info className="h-5 w-5 text-indigo-400 mt-1" />
        <p className="ml-3 text-sm text-gray-500">
          Your location information is used only for tracking power outages in your area.
          We never share your exact location with third parties.
        </p>
      </div>
    </div>
  );
};

export default DetailsStep;
