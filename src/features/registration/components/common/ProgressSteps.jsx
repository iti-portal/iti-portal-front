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
        return `${baseClasses} bg-red-400 text-[#203947] border-red-400 shadow-lg`;
      case 'current':
        return `${baseClasses} bg-red-400 text-[#203947] border-red-400 ring-4 ring-red-400/30 shadow-lg`;
      case 'upcoming':
        return `${baseClasses} bg-white/20 text-white/70 border-white/30`;
      default:
        return baseClasses;
    }
  };

  const getLabelClasses = (status) => {
    const baseClasses = `mt-2 ${config.label} font-medium text-center transition-colors duration-200`;
    
    switch (status) {
      case 'completed':
        return `${baseClasses} text-red-400`;
      case 'current':
        return `${baseClasses} text-red-400 font-semibold`;
      case 'upcoming':
        return `${baseClasses} text-white/60`;
      default:
        return baseClasses;
    }
  };

  const getConnectorClasses = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const isCompleted = stepNumber <= currentStepIndex;
    
    return `flex-1 ${config.connector} mx-3 rounded-full transition-colors duration-200 ${
      isCompleted ? 'bg-yellow-400' : 'bg-white/20'
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
