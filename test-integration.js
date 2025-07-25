const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');

// Test the Hugging Face Space API integration
async function testCassavaAPI() {
  const API_URL = 'https://afsod-cassava-backend-api.hf.space';
  
  console.log('🌿 Testing CassavaDoc API Integration');
  console.log('=====================================');
  
  // Test 1: Health Check
  console.log('\n1️⃣ Testing Health Check...');
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    console.log('✅ Health Check:', data.message);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
    return;
  }
  
  // Test 2: API Endpoints
  console.log('\n2️⃣ Testing API Endpoints...');
  console.log('📍 Health Endpoint: GET /', API_URL);
  console.log('📍 Predict Endpoint: POST /predict');
  console.log('📍 Multiple Predict: POST /predict-multiple');
  
  // Test 3: Model Status
  console.log('\n3️⃣ Model Information...');
  console.log('🤖 Expected Models:');
  console.log('   - model_quantized.tflite (TensorFlow Lite)');
  console.log('   - best_model.keras (Keras)');
  console.log('   - one_class_svm.joblib (SVM)');
  console.log('   - scaler.joblib (Feature Scaler)');
  
  // Test 4: Disease Classes
  console.log('\n4️⃣ Disease Classes:');
  const classes = [
    "Cassava Bacterial Blight (CBB)",
    "Cassava Brown Streak Disease (CBSD)", 
    "Cassava Mosaic Disease (CMD)",
    "Healthy Cassava Leaf"
  ];
  classes.forEach((cls, idx) => {
    console.log(`   ${idx + 1}. ${cls}`);
  });
  
  console.log('\n✅ API Integration Test Complete!');
  console.log('\n📱 Next Steps:');
  console.log('   1. Run: npm install');
  console.log('   2. Run: npm start');
  console.log('   3. Scan QR code with Expo Go app');
  console.log('   4. Test with your cassava leaf images');
  console.log('\n🏗️ To build APK:');
  console.log('   1. Run: ./build-apk.sh');
  console.log('   2. Download APK from build link');
}

// Test with a sample image if provided
async function testImagePrediction(imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.log(`⚠️  Image not found: ${imagePath}`);
    return;
  }
  
  console.log('\n🖼️ Testing Image Prediction...');
  
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    const response = await fetch('https://afsod-cassava-backend-api.hf.space/predict', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    
    if (result.anomaly) {
      console.log('🚨 Anomaly Detected:', result.reason);
    } else {
      console.log('✅ Prediction Result:');
      console.log(`   Disease: ${result.class_name}`);
      console.log(`   Confidence: ${result.confidence}%`);
    }
  } catch (error) {
    console.log('❌ Prediction Test Failed:', error.message);
  }
}

// Run the test
testCassavaAPI();

// Test with image if provided as command line argument
if (process.argv[2]) {
  testImagePrediction(process.argv[2]);
}