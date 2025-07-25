import { CLASS_NAMES } from '../constants/diseaseData';
import ApiService from '../services/apiService';

// Real prediction function using backend API
export const predictImage = async (imageUri) => {
  try {
    // Check if API is available
    const isApiAvailable = await ApiService.isApiAvailable();
    
    if (!isApiAvailable) {
      // Fallback to mock prediction if API is unavailable
      console.warn('Backend API unavailable, using fallback prediction');
      return await mockPredictImage(imageUri);
    }

    // Use real backend API
    const result = await ApiService.predictImage(imageUri);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;
    
    // Handle anomaly detection from backend
    if (data.anomaly) {
      throw new Error(data.reason);
    }

    return {
      className: data.class_name,
      confidence: data.confidence,
      isFromAPI: true
    };

  } catch (error) {
    console.error('Prediction error:', error);
    
    // Fallback to mock prediction on error
    console.warn('Using fallback prediction due to error:', error.message);
    return await mockPredictImage(imageUri);
  }
};

// Anomaly detection using backend API
export const detectAnomaly = async (imageUri) => {
  try {
    // The backend API handles anomaly detection as part of prediction
    // So we'll do a quick check here and let the main prediction handle it
    const isApiAvailable = await ApiService.isApiAvailable();
    
    if (!isApiAvailable) {
      // Basic local validation
      return mockDetectAnomaly(imageUri);
    }

    // API will handle anomaly detection in predictImage
    return { isValid: true, reason: "Will be checked by API" };

  } catch (error) {
    console.error('Anomaly detection error:', error);
    return mockDetectAnomaly(imageUri);
  }
};

// Mock prediction function as fallback
const mockPredictImage = async (imageUri) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock prediction results
  const predictions = [
    Math.random() * 0.3, // CBB
    Math.random() * 0.3, // CBSD
    Math.random() * 0.3, // CMD
    Math.random() * 0.4 + 0.6 // Healthy (higher probability)
  ];
  
  // Normalize predictions
  const sum = predictions.reduce((a, b) => a + b, 0);
  const normalizedPredictions = predictions.map(p => p / sum);
  
  const predictedIdx = normalizedPredictions.indexOf(Math.max(...normalizedPredictions));
  const confidence = normalizedPredictions[predictedIdx] * 100;
  
  return {
    className: CLASS_NAMES[predictedIdx],
    confidence: confidence,
    predictions: normalizedPredictions,
    isFromAPI: false
  };
};

// Mock anomaly detection as fallback
const mockDetectAnomaly = (imageUri) => {
  const isValid = Math.random() > 0.1; // 90% chance of valid image
  
  if (!isValid) {
    const anomalyTypes = [
      "Insufficient vegetation detected",
      "Image too dark or blurry",
      "Multiple objects detected",
      "Non-leaf object detected"
    ];
    const randomAnomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    return { isValid: false, reason: randomAnomaly };
  }
  
  return { isValid: true, reason: "Valid cassava leaf image" };
};

// Multiple image prediction
export const predictMultipleImages = async (imageUris) => {
  try {
    const isApiAvailable = await ApiService.isApiAvailable();
    
    if (!isApiAvailable) {
      // Fallback: predict each image individually
      const results = [];
      for (let i = 0; i < imageUris.length; i++) {
        const prediction = await mockPredictImage(imageUris[i]);
        results.push({
          image_index: i + 1,
          anomaly: false,
          class_name: prediction.className,
          confidence: prediction.confidence
        });
      }
      return { results, isFromAPI: false };
    }

    // Use real backend API
    const result = await ApiService.predictMultipleImages(imageUris);
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return { ...result.data, isFromAPI: true };

  } catch (error) {
    console.error('Multiple prediction error:', error);
    
    // Fallback to individual predictions
    const results = [];
    for (let i = 0; i < imageUris.length; i++) {
      try {
        const prediction = await mockPredictImage(imageUris[i]);
        results.push({
          image_index: i + 1,
          anomaly: false,
          class_name: prediction.className,
          confidence: prediction.confidence
        });
      } catch (err) {
        results.push({
          image_index: i + 1,
          error: err.message
        });
      }
    }
    return { results, isFromAPI: false };
  }
};

// Image preprocessing utility
export const preprocessImage = (imageUri) => {
  // In a real implementation, this would:
  // 1. Resize image to 224x224
  // 2. Normalize pixel values
  // 3. Convert to tensor format
  // For now, just return the URI
  return imageUri;
};