# 🔗 Backend Integration Guide

This guide explains how to integrate your ML backend with the React Native mobile app.

## 🏗️ **Architecture Overview**

```
Mobile App (React Native) ←→ Backend API (Flask) ←→ ML Models (TensorFlow/Keras)
```

- **Mobile App**: Captures images and sends to backend
- **Backend API**: Processes images using trained ML models
- **ML Models**: TensorFlow Lite, Keras, and SVM models for disease detection

## 📋 **Prerequisites**

1. **Python 3.8+** installed
2. **Your trained ML models** (replace placeholder files)
3. **Internet connection** for API calls
4. **React Native development environment** set up

## 🚀 **Quick Setup**

### 1. **Replace Model Files**

Your backend currently has placeholder model files. Replace these with your actual trained models:

```bash
backend/model/
├── model_quantized.tflite     # TensorFlow Lite model
├── best_model.keras           # Keras model
├── one_class_svm.joblib       # SVM model for anomaly detection
└── scaler.joblib              # Feature scaler
```

### 2. **Start Backend Server**

```bash
# Option 1: Use the setup script
./setup-backend.sh

# Option 2: Manual setup
cd backend
pip install -r requirements.txt
python app.py
```

The backend will be available at `http://localhost:7860`

### 3. **Test Backend API**

```bash
# Health check
curl http://localhost:7860/

# Test prediction (replace with actual image)
curl -X POST -F "image=@test_image.jpg" http://localhost:7860/predict
```

### 4. **Run Mobile App**

```bash
# Install dependencies
npm install

# Start development server
npm start

# Scan QR code with Expo Go app
```

## 🔧 **Configuration Options**

### Backend URL Configuration

Update the backend URL in `src/config/api.js`:

```javascript
export const API_CONFIG = {
  // For local development
  LOCAL_DEV: 'http://localhost:7860',
  
  // For production deployment
  PRODUCTION: 'https://your-backend-url.com',
  
  // Using Hugging Face Spaces
  HUGGINGFACE_SPACE: 'https://afsod-cassava-backend-api.hf.space',
};
```

### Development vs Production

- **Development**: Uses `http://localhost:7860`
- **Production**: Uses your deployed backend URL

## 📱 **Mobile App Features**

### ✅ **Implemented Features**

- **Real API Integration**: Calls your Flask backend
- **Fallback Mode**: Works offline if backend unavailable
- **Error Handling**: Graceful degradation with user feedback
- **Image Upload**: Sends images to backend for analysis
- **Result Display**: Shows API vs offline mode results
- **History Tracking**: Saves analysis results locally

### 🔄 **API Flow**

1. **Image Capture**: User takes photo or selects from gallery
2. **API Check**: App checks if backend is available
3. **Image Upload**: Sends image to `/predict` endpoint
4. **ML Processing**: Backend processes with your models
5. **Result Display**: Shows disease prediction and confidence
6. **History Save**: Stores result locally on device

## 🌐 **Deployment Options**

### Option 1: Hugging Face Spaces (Recommended)

Your backend is already set up as a Hugging Face Space. To use it:

1. **Update model files** in your Hugging Face repository
2. **Set production URL** in `src/config/api.js`:
   ```javascript
   PRODUCTION: 'https://afsod-cassava-backend-api.hf.space'
   ```

### Option 2: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy backend
cd backend
railway login
railway init
railway up
```

### Option 3: Render

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`

### Option 4: Heroku

```bash
# Install Heroku CLI and login
cd backend
heroku create your-app-name
git add .
git commit -m "Deploy backend"
git push heroku main
```

## 🧪 **Testing the Integration**

### 1. **Test Backend Locally**

```bash
# Start backend
./setup-backend.sh

# In another terminal, test the app
npm start
```

### 2. **Test API Endpoints**

```bash
# Health check
curl http://localhost:7860/

# Single image prediction
curl -X POST -F "image=@test_leaf.jpg" http://localhost:7860/predict

# Multiple images
curl -X POST -F "images=@leaf1.jpg" -F "images=@leaf2.jpg" http://localhost:7860/predict-multiple
```

### 3. **Test Mobile App**

1. **Start the app** and try capturing an image
2. **Check console logs** for API calls
3. **Verify result screen** shows "🌐 Online (API)" mode
4. **Test offline mode** by stopping backend

## 🔍 **Troubleshooting**

### Common Issues

1. **"Backend service is unavailable"**
   - Check if backend server is running
   - Verify URL in `src/config/api.js`
   - Check network connectivity

2. **"Invalid image format"**
   - Ensure image is in supported format (JPG, PNG)
   - Check image file size (should be reasonable)

3. **Model loading errors**
   - Replace placeholder model files with actual trained models
   - Check model file paths in `backend/backend_utils.py`

4. **CORS errors**
   - Add CORS headers to Flask app if needed
   - Use proper API URL (not localhost for production)

### Debug Mode

Enable debug logging in the mobile app:

```javascript
// In src/services/apiService.js
console.log('API Request:', this.baseURL);
console.log('Response:', result);
```

## 📊 **API Response Format**

### Single Prediction

```json
{
  "anomaly": false,
  "class_name": "Cassava Bacterial Blight (CBB)",
  "confidence": 87.3
}
```

### Multiple Predictions

```json
{
  "results": [
    {
      "image_index": 1,
      "anomaly": false,
      "class_name": "Healthy Cassava Leaf",
      "confidence": 92.1
    }
  ]
}
```

### Anomaly Detection

```json
{
  "anomaly": true,
  "reason": "Insufficient vegetation detected"
}
```

## 🎯 **Next Steps**

1. **Replace model files** with your trained models
2. **Test locally** with real cassava images
3. **Deploy backend** to your preferred platform
4. **Update production URL** in mobile app
5. **Build APK** for distribution

## 📞 **Need Help?**

If you encounter any issues:

1. **Check the logs** in both backend and mobile app
2. **Verify model files** are properly loaded
3. **Test API endpoints** independently
4. **Check network connectivity**

The integration is designed to be robust with fallback modes, so the app will work even if the backend is temporarily unavailable.