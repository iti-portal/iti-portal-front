/**
 * Format date for display
 * @param {string|Date} date Date to format
 * @param {Object} options Format options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format number with thousand separators
 * @param {number} number Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return 'N/A';
  return number.toLocaleString();
};

/**
 * Create download URL for admin reports
 * @param {string} reportType Type of report
 * @param {Object} filters Filter parameters
 * @returns {string} Download URL
 */
export const getReportUrl = (reportType, filters = {}) => {
  const baseUrl = '/api/admin/reports';
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return `${baseUrl}/${reportType}${queryString ? `?${queryString}` : ''}`;
};
