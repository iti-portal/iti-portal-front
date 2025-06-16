import React from 'react';
import { getStepsForRole } from '../../constants/registrationSteps';

/**
 * Progress steps component
 * Shows the current progress through the registration flow
 */
const ProgressSteps = ({ 
  currentStep, 
  role, 
  className = '',
  showLabels = true,
  size = 'default' // 'small', 'default', 'large'
}) => {
  const steps = getStepsForRole(role);
  
  // Size configurations
  const sizeConfig = {
    small: {
      circle: 'w-8 h-8 text-sm',
      label: 'text-xs',
      connector: 'h-0.5'
    },
    default: {
      circle: 'w-10 h-10 text-base',
      label: 'text-xs',
      connector: 'h-1'
    },
    large: {
      circle: 'w-12 h-12 text-lg',
      label: 'text-sm',
      connector: 'h-1'
    }
  };

  const config = sizeConfig[size] || sizeConfig.default;

  const getStepStatus = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepNumber === currentStepIndex + 1) return 'current';
    if (stepNumber < currentStepIndex + 1) return 'completed';
    return 'upcoming';
  };

  const getStepClasses = (status) => {
    const baseClasses = `${config.circle} flex items-center justify-center rounded-full font-semibold border-2 transition-all duration-200`;
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-[#901b20] text-white border-[#901b20]`;
      case 'current':
        return `${baseClasses} bg-[#901b20] text-white border-[#901b20] ring-4 ring-[#901b20] ring-opacity-20`;
      case 'upcoming':
        return `${baseClasses} bg-gray-100 text-gray-500 border-gray-300`;
      default:
        return baseClasses;
    }
  };

  const getLabelClasses = (status) => {
    const baseClasses = `mt-2 ${config.label} font-medium text-center transition-colors duration-200`;
    
    switch (status) {
      case 'completed':
        return `${baseClasses} text-[#901b20]`;
      case 'current':
        return `${baseClasses} text-[#901b20] font-semibold`;
      case 'upcoming':
        return `${baseClasses} text-gray-500`;
      default:
        return baseClasses;
    }
  };

  const getConnectorClasses = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const isCompleted = stepNumber <= currentStepIndex;
    
    return `flex-1 ${config.connector} mx-3 rounded-full transition-colors duration-200 ${
      isCompleted ? 'bg-[#901b20]' : 'bg-gray-200'
    }`;
  };

  const renderStepIcon = (step, status, stepIndex) => {
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    }
    
    return stepIndex + 1;
  };

  return (
    <div className={`flex items-center justify-center px-4 py-6 ${className}`}>
      <div className="flex items-center w-full max-w-2xl">
        {steps.map((step, stepIndex) => {
          const status = getStepStatus(stepIndex);
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Step Circle */}
                <div className={getStepClasses(status)}>
                  {renderStepIcon(step, status, stepIndex)}
                </div>
                
                {/* Step Label */}
                {showLabels && (
                  <span className={getLabelClasses(status)}>
                    {step.label}
                  </span>
                )}
              </div>
              
              {/* Connector Line */}
              {stepIndex < steps.length - 1 && (
                <div className={getConnectorClasses(stepIndex)} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;
