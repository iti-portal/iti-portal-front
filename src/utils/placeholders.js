/**
 * Utility functions for generating local placeholder images
 * Avoids external dependencies and network requests
 */

/**
 * Generate a placeholder avatar image as a data URL
 * @param {string} text - Text to display in the placeholder
 * @param {string} bgColor - Background color (hex without #)
 * @param {string} textColor - Text color (default: white)
 * @param {number} size - Size in pixels (default: 150)
 * @returns {string} Data URL for the placeholder image
 */
export const generatePlaceholderAvatar = (
  text = 'User',
  bgColor = '901b20',
  textColor = 'white',
  size = 150
) => {
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.round(size / 10)}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generate a placeholder cover photo as a data URL
 * @param {string} text - Text to display in the placeholder
 * @param {string} bgColor - Background color (hex without #)
 * @param {string} textColor - Text color (default: white)
 * @param {number} width - Width in pixels (default: 1200)
 * @param {number} height - Height in pixels (default: 300)
 * @returns {string} Data URL for the placeholder image
 */
export const generatePlaceholderCover = (
  text = 'Cover Photo',
  bgColor = '901b20',
  textColor = 'white',
  width = 1200,
  height = 300
) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${adjustBrightness(bgColor, 20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad1)"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.round(height / 12)}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Adjust the brightness of a hex color
 * @param {string} hex - Hex color without # prefix
 * @param {number} percent - Percentage to adjust brightness (-100 to 100)
 * @returns {string} Adjusted hex color without # prefix
 */
const adjustBrightness = (hex, percent) => {
  const num = parseInt(hex, 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1);
};

// Pre-generated common placeholders
export const PLACEHOLDERS = {
  AVATAR_USER: generatePlaceholderAvatar('User'),
  AVATAR_PROFILE: generatePlaceholderAvatar('Profile'),
  COVER_PHOTO: generatePlaceholderCover('Add Cover Photo'),
  COVER_DEFAULT: generatePlaceholderCover('Cover Photo'),
};
