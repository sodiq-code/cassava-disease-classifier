# 🌿 CassavaDoc Mobile App

A React Native mobile application for AI-powered cassava leaf disease detection. This app allows users to capture or upload images of cassava leaves and get instant disease diagnosis with treatment recommendations.

## 📱 Features

- **Camera Integration**: Capture high-quality images of cassava leaves
- **Image Gallery**: Select images from device gallery
- **AI Disease Detection**: Analyze images for common cassava diseases
- **Disease Information**: Detailed information about detected diseases
- **Treatment Recommendations**: Suggested treatments for each disease
- **Analysis History**: View and manage past diagnoses
- **Share Results**: Share analysis results with others
- **Offline Support**: Basic functionality works without internet

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or later
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CassavaDocApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install Expo CLI globally**
   ```bash
   npm install -g expo-cli
   # or
   npm install -g @expo/cli
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

## 📦 Building APK File

### Method 1: Using Expo Application Services (EAS) - Recommended

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   eas build:configure
   ```

4. **Build APK for Android**
   ```bash
   # For development/testing (APK)
   eas build --platform android --profile preview
   
   # For production (AAB for Google Play Store)
   eas build --platform android --profile production
   ```

5. **Download the APK**
   - After the build completes, you'll receive a download link
   - The APK will be available in your Expo dashboard
   - Install the APK on your Android device

### Method 2: Using Expo CLI (Legacy)

1. **Build for Android**
   ```bash
   expo build:android -t apk
   ```

2. **Download the APK**
   - Check build status: `expo build:status`
   - Download from the provided URL

### Method 3: Local Build with EAS

1. **Install Android Studio and configure environment**
2. **Run local build**
   ```bash
   eas build --platform android --local
   ```

## 🛠️ Development

### Project Structure

```
CassavaDocApp/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # App screens
│   ├── utils/              # Utility functions
│   ├── constants/          # App constants
├── assets/                 # Images, icons, fonts
├── App.js                 # Main app component
├── package.json           # Dependencies
├── app.json              # Expo configuration
└── eas.json              # EAS build configuration
```

### Key Components

- **HomeScreen**: Main screen with image capture/selection options
- **CameraScreen**: Camera interface for capturing leaf images
- **ResultScreen**: Display analysis results and disease information
- **HistoryScreen**: View past analysis history
- **ActionButton**: Reusable button component
- **LoadingSpinner**: Loading animation component

### Adding Real ML Model

The current app uses mock prediction functions. To integrate a real ML model:

1. **Replace mock functions in `src/utils/imageProcessing.js`**
2. **Add TensorFlow.js or TensorFlow Lite integration**
3. **Include your trained model files in the app bundle**
4. **Update prediction logic with actual model inference**

Example TensorFlow.js integration:
```javascript
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

// Load your model
const model = await tf.loadLayersModel('path/to/your/model.json');

// Make predictions
const prediction = model.predict(processedImageTensor);
```

## 🎨 Customization

### Colors and Theming

Update colors in `src/constants/diseaseData.js`:

```javascript
export const COLORS = {
  primary: '#16a34a',      // Main green color
  secondary: '#22c55e',    // Secondary green
  background: '#f8fafc',   // Background color
  // ... other colors
};
```

### Disease Information

Modify disease data in `src/constants/diseaseData.js`:

```javascript
export const DISEASE_INFO = {
  "Disease Name": {
    icon: "🦠",
    severity: "High",
    color: "#dc2626",
    description: "Disease description",
    treatment: "Treatment recommendations"
  }
};
```

### App Icons and Splash Screen

1. **Replace icons in `assets/` directory**
   - `icon.png` (1024x1024px)
   - `adaptive-icon.png` (1024x1024px)
   - `splash.png` (1284x2778px)
   - `favicon.png` (48x48px)

2. **Update app configuration in `app.json`**

## 📱 Testing

### On Physical Device

1. **Install Expo Go app** on your Android/iOS device
2. **Scan QR code** from `expo start` command
3. **Test all features** including camera and image selection

### On Emulator

1. **Android**: Use Android Studio emulator
2. **iOS**: Use Xcode Simulator (macOS only)

## 🚀 Deployment

### Google Play Store

1. **Build AAB file**
   ```bash
   eas build --platform android --profile production
   ```

2. **Upload to Google Play Console**
3. **Fill out store listing information**
4. **Submit for review**

### Direct APK Distribution

1. **Build APK**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Distribute APK file** directly to users
3. **Users need to enable "Install from unknown sources"**

## 🔧 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build failures**
   - Check Android SDK configuration
   - Verify Java version compatibility
   - Clear build cache

3. **Camera permissions**
   - Ensure permissions are properly configured in `app.json`
   - Test on physical device (camera doesn't work in simulators)

4. **Image picker issues**
   - Check media library permissions
   - Test with different image formats

### Build Issues

1. **EAS build failures**
   - Check build logs in Expo dashboard
   - Verify all dependencies are compatible
   - Check for missing assets

2. **APK installation issues**
   - Enable "Unknown sources" on Android
   - Check APK signature
   - Verify Android version compatibility

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Expo documentation

---

**Note**: This app currently uses mock ML predictions. Replace the prediction logic in `src/utils/imageProcessing.js` with your actual trained model for real disease detection.
