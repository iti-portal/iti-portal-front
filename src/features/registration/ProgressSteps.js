// components/ProgressSteps.js
import React from 'react';

const allSteps = [
  { label: 'Basic Info' },
  { label: 'Personal Info' },
  { label: 'Security' },
  { label: 'Review' },
];

const ProgressSteps = ({ currentStep, role }) => {
  // Remove "Security" step if role is company
  const steps = role === 'company'
    ? allSteps.filter(step => step.label !== 'Security')
    : allSteps;

  return (
    <div className="flex items-center mt-8 mb-8 px-2">
      {steps.map((step, idx) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg border-2
                ${currentStep === idx + 1
                  ? 'bg-[#901b20] text-white border-[#901b20]'
                  : currentStep > idx + 1
                  ? 'bg-[#901b20] text-white border-[#901b20]'
                  : 'bg-gray-200 text-gray-500 border-gray-300'
                }`}
            >
              {idx + 1}
            </div>
            <span className={`mt-2 text-xs font-semibold ${currentStep === idx + 1 ? 'text-[#901b20]' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-1 mx-2 bg-gray-200 relative">
              <div
                className={`absolute top-0 left-0 h-1 ${currentStep > idx + 1 ? 'bg-[#901b20]' : 'bg-gray-200'}`}
                style={{ width: '100%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;