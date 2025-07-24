import { CLASS_NAMES } from '../constants/diseaseData';

// Mock prediction function - replace with actual ML model integration
export const predictImage = async (imageUri) => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock prediction results - replace with actual model inference
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
    predictions: normalizedPredictions
  };
};

// Simple anomaly detection
export const detectAnomaly = (imageUri) => {
  // Mock anomaly detection - in real app, this would analyze the image
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

// Image preprocessing utility
export const preprocessImage = (imageUri) => {
  // In a real implementation, this would:
  // 1. Resize image to 224x224
  // 2. Normalize pixel values
  // 3. Convert to tensor format
  // For now, just return the URI
  return imageUri;
};