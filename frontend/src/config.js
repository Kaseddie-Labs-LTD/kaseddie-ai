/**
 * API Configuration
 * Uses environment variable VITE_API_URL if available, otherwise defaults to localhost
 */

// Get API base URL from environment or use localhost for development
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper function to construct full API URLs
 * @param {string} path - API endpoint path (e.g., '/api/trades' or 'api/trades')
 * @returns {string} Full API URL
 */
export function getApiUrl(path) {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash from base URL if present
  const baseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  
  return `${baseUrl}${normalizedPath}`;
}

// Log the API base URL in development
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE);
}
