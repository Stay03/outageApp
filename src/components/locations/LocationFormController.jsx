import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ChevronRight, ArrowLeft, MapPin } from 'lucide-react';
import LocationNameStep from './steps/LocationNameStep';
import AddressStep from './steps/AddressStep';
import DetailsStep from './steps/DetailsSteps';
import ProgressSteps from './ProgressSteps';

const steps = [
  { id: 1, name: 'Name' },
  { id: 2, name: 'Address' },
  { id: 3, name: 'Details' }
];

const LocationFormController = ({ onSubmit, isLoading, error }) => {
  // Ref to track manual form submission
  const submitIntentionallyRef = useRef(false);
  
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    locality: '',
    city: '',
    country: '',
    latitude: null,
    longitude: null
  });
  
  // Step validation state
  const [stepValidation, setStepValidation] = useState({
    1: false,
    2: false,
    3: true // Details step is always valid since all required fields are in previous steps
  });
  
  // Map center state for the map component
  const [mapCenter, setMapCenter] = useState({
    lat: 5.57,
    lng: -0.26
  });
  
  // Reset submission intent when changing steps
  useEffect(() => {
    submitIntentionallyRef.current = false;
  }, [currentStep]);
  
  // Update form data handler
  const updateFormData = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  
  // Update map center when address is selected
  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      setMapCenter({
        lat: formData.latitude,
        lng: formData.longitude
      });
    }
  }, [formData.latitude, formData.longitude]);
  
  // Validate step 1
  useEffect(() => {
    setStepValidation(prev => ({
      ...prev,
      1: !!formData.name.trim()
    }));
  }, [formData.name]);
  
  // Validate step 2
  useEffect(() => {
    setStepValidation(prev => ({
      ...prev,
      2: !!formData.address.trim() && 
         !!formData.latitude && 
         !!formData.longitude
    }));
  }, [formData.address, formData.latitude, formData.longitude]);
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle manual submission click - sets the intent flag
  const handleSaveClick = () => {
    submitIntentionallyRef.current = true;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    // Always prevent default form submission
    if (e) e.preventDefault();
    
    // Only submit if we're on the last step AND the submission was intentional
    if (currentStep === steps.length && submitIntentionallyRef.current) {
      onSubmit(formData);
    }
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <LocationNameStep 
            name={formData.name} 
            onChange={updateFormData} 
          />
        );
      case 2:
        return (
          <AddressStep 
            formData={formData}
            onChange={updateFormData}
            mapCenter={mapCenter}
            setMapCenter={setMapCenter}
          />
        );
      case 3:
        return (
          <DetailsStep 
            formData={formData}
            onChange={updateFormData}
            mapCenter={mapCenter}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Progress indicator */}
      <div className="px-6 pt-6 pb-2">
        <ProgressSteps steps={steps} currentStep={currentStep} />
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step content with animation */}
      <form onSubmit={handleSubmit}>
        <div 
          key={currentStep}
          className="p-6 transition-all duration-300 ease-in-out"
        >
          {renderStepContent()}
        </div>
        
        {/* Navigation buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
          {/* Back button - only show if not on first step */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          ) : (
            <div></div> // Empty div to maintain flex spacing
          )}
          
          {/* Next/Submit button */}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={!stepValidation[currentStep]}
              className={`inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                stepValidation[currentStep]
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' 
                  : 'bg-indigo-300 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              type="button" // Changed from "submit" to "button"
              onClick={() => {
                handleSaveClick();
                handleSubmit();
              }}
              disabled={isLoading || !stepValidation[1] || !stepValidation[2]}
              className={`inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isLoading || !stepValidation[1] || !stepValidation[2]
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Location
                </span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LocationFormController;