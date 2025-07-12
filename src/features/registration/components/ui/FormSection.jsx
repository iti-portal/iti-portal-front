import React from 'react';

/**
 * Form section wrapper component
 * Provides consistent styling and layout for form sections
 */
const FormSection = ({
  title,
  description,
  children,
  className = '',
  titleClassName = '',
  descriptionClassName = '',
  contentClassName = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className={`text-base font-semibold text-gray-800 ${titleClassName}`}>
              {title}
            </h3>
          )}
          {description && (
            <p className={`text-sm text-gray-600 ${descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className={`space-y-4 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default FormSection;
