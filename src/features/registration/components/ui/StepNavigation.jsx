import React from 'react';

/**
 * Step navigation component
 * Provides navigation buttons between form steps
 */
const StepNavigation = ({
  canGoPrevious = false,
  canGoNext = false,
  isLastStep = false,
  isSubmitting = false,
  onPrevious,
  onNext,
  onSubmit,
  nextLabel = 'Next',
  previousLabel = 'Previous',
  submitLabel = 'Submit Registration',
  className = ''
}) => {
  const handleNext = () => {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else if (onNext) {
      onNext();
    }
  };

  return (
    <div className={`flex justify-between pt-6 ${className}`}>
      {/* Previous Button */}
      <div>
        {canGoPrevious && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={isSubmitting}
            className="
              inline-flex items-center px-4 py-2.5 border border-gray-200 
              text-sm font-medium rounded-lg text-gray-700 bg-white 
              hover:bg-gray-50 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-[#901b20]/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            "
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            {previousLabel}
          </button>
        )}
      </div>

      {/* Next/Submit Button */}
      <div>
        {(canGoNext || isLastStep) && (
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="
              inline-flex items-center px-6 py-2.5 border border-transparent 
              text-sm font-medium rounded-lg text-white 
              bg-gradient-to-r from-[#901b20] to-[#203947]
              hover:from-[#7a1419] hover:to-[#1a2f3a] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#901b20]/20
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200 transform hover:scale-105
              shadow-lg hover:shadow-xl
            "
          >
            {isSubmitting ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                {isLastStep ? submitLabel : nextLabel}
                {!isLastStep && (
                  <svg 
                    className="w-4 h-4 ml-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                )}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepNavigation;
