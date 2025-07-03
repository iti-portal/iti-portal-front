import React from 'react';

/**
 * Reusable form field component
 * Handles input, textarea, select, and file inputs with consistent styling
 */
const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [], // for select inputs
  accept, // for file inputs
  className = '',
  inputClassName = '',
  labelClassName = '',
  errorClassName = '',
  helpText,
  ...props
}) => {
  const inputId = `${name}-input`;
  
  const baseInputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm text-sm
    focus:outline-none focus:ring-1 focus:ring-[#901b20] focus:border-[#901b20]
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 text-red-900 placeholder-red-300' : 'border-gray-300 text-gray-900'}
    ${inputClassName}
  `;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            rows={4}
            {...props}
          />
        );

      case 'select':
        return (
          <select
            id={inputId}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          >
            <option value="">{placeholder || `Select ${label}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            id={inputId}
            name={name}
            type="file"
            onChange={onChange}
            onBlur={onBlur}
            accept={accept}
            required={required}
            disabled={disabled}
            className={`
              block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-[#901b20] file:text-white
              hover:file:bg-[#7a1419]
              ${inputClassName}
            `}
            {...props}
          />
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${inputId}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  required={required}
                  disabled={disabled}
                  className="h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300"
                  {...props}
                />
                <label
                  htmlFor={`${inputId}-${option.value}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={inputId}
              name={name}
              type="checkbox"
              checked={value || false}
              onChange={onChange}
              onBlur={onBlur}
              required={required}
              disabled={disabled}
              className="h-4 w-4 text-[#901b20] focus:ring-[#901b20] border-gray-300 rounded"
              {...props}
            />
            <label htmlFor={inputId} className="ml-2 block text-sm text-gray-900">
              {label}
            </label>
          </div>
        );

      default:
        return (
          <input
            id={inputId}
            name={name}
            type={type}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={baseInputClasses}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`space-y-1 ${className}`}>
        {renderInput()}
        {error && (
          <p className={`text-sm text-red-600 ${errorClassName}`}>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${error ? 'text-red-700' : 'text-gray-700'} ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};

export default FormField;
