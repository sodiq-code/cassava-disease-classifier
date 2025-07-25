// API Configuration
export const API_CONFIG = {
  // Development URLs
  LOCAL_DEV: 'http://localhost:7860',
  LOCAL_DEV_ANDROID: 'http://10.0.2.2:7860', // Android emulator localhost
  LOCAL_DEV_IOS: 'http://localhost:7860',     // iOS simulator localhost
  
  // Production URLs - UPDATE THESE WITH YOUR DEPLOYED BACKEND
  PRODUCTION: 'https://your-backend-url.com',
  HUGGINGFACE_SPACE: 'https://afsod-cassava-backend-api.hf.space',
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Get the appropriate API URL based on environment
export const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    return API_CONFIG.LOCAL_DEV;
  } else {
    // Production mode - you can customize this logic
    return API_CONFIG.HUGGINGFACE_SPACE; // Default to Hugging Face Space
  }
};

// Network configuration
export const NETWORK_CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
};

// API endpoints
export const API_ENDPOINTS = {
  HEALTH: '/',
  PREDICT: '/predict',
  PREDICT_MULTIPLE: '/predict-multiple',
};

// Error messages
export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_IMAGE: 'Invalid image format. Please select a valid image.',
  NO_BACKEND: 'Backend service is unavailable. Using offline mode.',
};