import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        
        return (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="relative">
              <div 
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  transition-all duration-300 
                  ${isCompleted 
                    ? 'bg-indigo-600 text-white' 
                    : isActive 
                      ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-600' 
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              
              {/* Step Label */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span 
                  className={`text-xs font-medium ${
                    isActive || isCompleted ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </div>
            
            {/* Connector Line (except after last step) */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  h-0.5 w-12 mx-2
                  ${step.id < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}
                  transition-all duration-300
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressSteps;