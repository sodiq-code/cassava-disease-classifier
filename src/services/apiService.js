import * as FileSystem from 'expo-file-system';
import { getApiUrl, API_ENDPOINTS, API_ERRORS, API_CONFIG } from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = getApiUrl();
    this.maxRetries = API_CONFIG.MAX_RETRIES;
    this.retryDelay = API_CONFIG.RETRY_DELAY;
  }

  /**
   * Health check for the backend API
   */
  async healthCheck() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API Health Check Error:', error);
      
      if (error.name === 'AbortError') {
        return { success: false, error: API_ERRORS.TIMEOUT_ERROR };
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * Predict disease from a single image
   * @param {string} imageUri - Local image URI
   * @returns {Promise<Object>} Prediction result
   */
  async predictImage(imageUri) {
    try {
      // Create FormData for image upload
      const formData = new FormData();
      
      // Get image info and create blob
      const imageInfo = await FileSystem.getInfoAsync(imageUri);
      if (!imageInfo.exists) {
        throw new Error('Image file not found');
      }

      // Create image blob for upload
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Determine file extension
      const fileExtension = imageUri.split('.').pop().toLowerCase();
      const mimeType = this.getMimeType(fileExtension);
      
      formData.append('image', {
        uri: imageUri,
        type: mimeType,
        name: `image.${fileExtension}`,
      });

      // Make API request
      const apiResponse = await fetch(`${this.baseURL}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const result = await apiResponse.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('API Predict Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Predict diseases from multiple images
   * @param {string[]} imageUris - Array of local image URIs
   * @returns {Promise<Object>} Prediction results
   */
  async predictMultipleImages(imageUris) {
    try {
      const formData = new FormData();
      
      // Add all images to form data
      for (let i = 0; i < imageUris.length; i++) {
        const imageUri = imageUris[i];
        const imageInfo = await FileSystem.getInfoAsync(imageUri);
        
        if (!imageInfo.exists) {
          console.warn(`Image ${i + 1} not found: ${imageUri}`);
          continue;
        }

        const fileExtension = imageUri.split('.').pop().toLowerCase();
        const mimeType = this.getMimeType(fileExtension);
        
        formData.append('images', {
          uri: imageUri,
          type: mimeType,
          name: `image_${i + 1}.${fileExtension}`,
        });
      }

      // Make API request
      const response = await fetch(`${this.baseURL}/predict-multiple`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('API Predict Multiple Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get MIME type for file extension
   * @param {string} extension - File extension
   * @returns {string} MIME type
   */
  getMimeType(extension) {
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp'
    };
    
    return mimeTypes[extension.toLowerCase()] || 'image/jpeg';
  }

  /**
   * Check if the API is available
   * @returns {Promise<boolean>} True if API is available
   */
  async isApiAvailable() {
    const healthResult = await this.healthCheck();
    return healthResult.success;
  }

  /**
   * Update the API base URL
   * @param {string} newUrl - New base URL
   */
  updateBaseUrl(newUrl) {
    this.baseURL = newUrl;
  }
}

// Export singleton instance
export default new ApiService();