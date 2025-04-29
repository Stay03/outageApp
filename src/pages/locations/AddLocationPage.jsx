import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../../hooks/useLocation';
import { useAuth } from '../../hooks/useAuth';
import LocationFormController from '../../components/locations/LocationFormController';
import { Transition } from '@headlessui/react';
import { MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Add Location page for first-time setup
 * Provides a form and map interface for adding a user's first location
 */
const AddLocationPage = () => {
  const navigate = useNavigate();
  const { addLocation, isLoading, locationError, clearLocationError } = useLocation();
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState(false);

  // Handle form submission
  const handleSubmit = async (locationData) => {
    try {
      clearLocationError();
      const result = await addLocation(locationData);
      setSuccess(true);

      // Redirect to dashboard after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

      return result;
    } catch (error) {
      console.error('Failed to add location:', error);
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <MapPinIcon className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Set Up Your First Location
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-md mx-auto">
          {currentUser?.name ? `Hi ${currentUser.name}! ` : ''}
          To track power outages in your area, we need to know where you're located.
        </p>
      </div>

      {/* Success message that shows after form submission */}
      <Transition
        show={success}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-90">
          <div className="text-center p-6 rounded-lg">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
            <h3 className="mt-2 text-xl font-medium text-gray-900">Location Added Successfully!</h3>
            <p className="mt-1 text-sm text-gray-500">
              Redirecting you to the dashboard...
            </p>
          </div>
        </div>
      </Transition>

      {/* Main content area */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl px-4">
        {/* Location form with error display */}
        <LocationFormController
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={locationError}
        />

        {/* Help text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your location information is used only for tracking power outages in your area.
            We never share your exact location with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddLocationPage;
