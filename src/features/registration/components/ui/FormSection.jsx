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
    <div className={`space-y-6 ${className}`}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h3 className={`text-lg font-medium text-gray-900 ${titleClassName}`}>
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
