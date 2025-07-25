# 📱 Testing CassavaDoc Mobile App from Cursor

## 🎯 **Quick Testing Options**

### **Option 1: Expo Go App (Recommended)**

#### **Step 1: Install Expo Go on Your Phone**
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iPhone**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)

#### **Step 2: Start Development Server**
```bash
# In Cursor terminal, run:
npm start
```

#### **Step 3: Scan QR Code**
- The terminal will show a QR code
- Open Expo Go app on your phone
- Scan the QR code
- The CassavaDoc app will load on your phone!

---

### **Option 2: Web Browser Testing**

#### **Start Web Version**
```bash
# In Cursor terminal:
npx expo start --web
```
- Opens in browser at `http://localhost:19006`
- Limited camera functionality but good for UI testing

---

### **Option 3: Android Studio Emulator**

#### **If you have Android Studio installed:**
```bash
# Start emulator first, then:
npm run android
```

---

### **Option 4: iOS Simulator (Mac only)**

#### **If you have Xcode installed:**
```bash
npm run ios
```

---

## 🧪 **Complete Testing Process**

### **1. Start the App**
```bash
# In Cursor terminal:
cd /workspace
npm install  # if not already done
npm start
```

### **2. What You'll See**
```
Starting Metro Bundler...
› Metro waiting on exp://192.168.x.x:19000
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### **3. Test on Your Phone**
1. **Scan QR code** with Expo Go app
2. **Wait for app to load** (first time may take 30-60 seconds)
3. **See the CassavaDoc home screen**

### **4. Test the Features**

#### **🏠 Home Screen Test**
- ✅ See beautiful green gradient header
- ✅ Three action buttons visible
- ✅ Photography tips section
- ✅ Smooth animations

#### **📷 Camera Test**
- ✅ Tap "Take Photo" button
- ✅ Camera interface opens
- ✅ Focus frame visible
- ✅ Flash and flip controls work
- ✅ Capture button responsive

#### **🔍 ML Prediction Test**
- ✅ Take photo of any leaf/plant
- ✅ See loading spinner with "Analyzing Image..."
- ✅ Get real prediction from your ML models
- ✅ Result shows "🌐 Online (API)" mode
- ✅ Confidence score displayed

#### **📊 Result Screen Test**
- ✅ Disease information card
- ✅ Treatment recommendations
- ✅ Analysis mode indicator
- ✅ Share functionality
- ✅ "Analyze Another" button

#### **📂 History Test**
- ✅ Previous analyses saved
- ✅ Thumbnails and metadata
- ✅ Tap to view details
- ✅ Clear history option

---

## 🌐 **API Testing Verification**

### **Check Real ML Integration**
When you test, verify these indicators:

1. **✅ "🌐 Online (API)"** in result screen
2. **✅ Real disease names** from your models
3. **✅ Actual confidence scores** (not random)
4. **✅ Fast response times** (2-5 seconds)
5. **✅ Proper error handling** for invalid images

### **Test with Different Images**
- **🌿 Cassava leaves**: Should get disease predictions
- **📷 Random objects**: Should get anomaly detection
- **🖼️ Gallery photos**: Should work from photo library

---

## 🔧 **Troubleshooting**

### **If QR Code Doesn't Work**
```bash
# Try tunnel mode:
npx expo start --tunnel
```

### **If Phone Can't Connect**
- Ensure phone and computer on same WiFi
- Check firewall settings
- Try mobile hotspot

### **If App Crashes**
- Check Cursor terminal for error logs
- Restart development server
- Clear Expo cache: `npx expo start -c`

### **If API Calls Fail**
- Check internet connection
- Verify Hugging Face Space is running
- Look for "📱 Offline (Local)" mode as fallback

---

## 📋 **Testing Checklist**

### **Basic Functionality**
- [ ] App loads successfully
- [ ] Home screen displays correctly
- [ ] Camera opens and works
- [ ] Photo capture functions
- [ ] Gallery selection works

### **ML Integration**
- [ ] Images upload to API
- [ ] Real predictions received
- [ ] Shows "🌐 Online (API)" mode
- [ ] Confidence scores accurate
- [ ] Disease information correct

### **User Experience**
- [ ] Smooth animations
- [ ] Responsive buttons
- [ ] Clear navigation
- [ ] Error messages helpful
- [ ] Loading states work

### **Advanced Features**
- [ ] History saves correctly
- [ ] Share functionality works
- [ ] Offline mode available
- [ ] Multiple image support
- [ ] Anomaly detection active

---

## 🎯 **Expected Test Results**

### **With Real Cassava Images**
```
Disease: Cassava Bacterial Blight (CBB)
Confidence: 87.3%
Severity: High
Mode: 🌐 Online (API)
```

### **With Invalid Images**
```
Anomaly Detected: Insufficient vegetation detected
Please try with a cassava leaf image
```

---

## 🚀 **Ready to Test!**

1. **Run**: `npm start` in Cursor terminal
2. **Scan**: QR code with Expo Go app
3. **Test**: Camera and gallery features
4. **Verify**: Real ML predictions working
5. **Enjoy**: Your production-ready app!

The app is fully integrated with your ML models and ready for real-world testing! 🌿📱