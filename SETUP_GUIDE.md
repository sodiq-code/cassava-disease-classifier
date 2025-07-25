# 🛠️ Complete Setup Guide - CassavaDoc Mobile App

## 🚨 **Why You Get Different Errors**

### **Common Causes:**
1. **Different Node.js versions** (16.x vs 18.x vs 20.x)
2. **npm version mismatches** (8.x vs 9.x vs 10.x)
3. **Platform differences** (Windows vs macOS vs Linux)
4. **Package version conflicts** (~1.0.0 vs ^1.0.0 vs 1.0.0)
5. **Cache issues** from previous installations
6. **Missing system dependencies**

## 🎯 **Best Setup Methods (Choose One)**

### **Method 1: Automated Setup Script** ⚡ (RECOMMENDED)

```bash
# Clone the repository
git clone https://github.com/sodiq-code/cassava-disease-classifier.git
cd cassava-disease-classifier

# Run automated setup
chmod +x setup-environment.sh
./setup-environment.sh

# Start the app
./run-app.sh
```

### **Method 2: Docker Setup** 🐳 (MOST RELIABLE)

```bash
# Clone the repository
git clone https://github.com/sodiq-code/cassava-disease-classifier.git
cd cassava-disease-classifier

# Build and run with Docker
docker-compose up --build

# Access at http://localhost:19000
```

### **Method 3: Manual Setup** 🔧 (IF YOU PREFER MANUAL)

#### **Step 1: Environment Requirements**
```bash
# Install Node.js 18.17.0 (EXACT VERSION)
# Download from: https://nodejs.org/download/release/v18.17.0/

# Verify versions
node --version  # Should be v18.17.0
npm --version   # Should be 9.6.7 or higher
```

#### **Step 2: Global Tools**
```bash
# Install Expo CLI
npm install -g @expo/cli@6.3.10

# Install EAS CLI (for building APK)
npm install -g eas-cli@latest

# Verify installations
expo --version
eas --version
```

#### **Step 3: Clean Install**
```bash
# Remove any existing installations
rm -rf node_modules package-lock.json yarn.lock

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install

# Fix Expo dependencies
npx expo install --fix
```

#### **Step 4: Start App**
```bash
# Start development server
npm start
# or
expo start --clear
```

## 🔧 **Platform-Specific Instructions**

### **Windows Setup** 🪟

```bash
# Use PowerShell as Administrator or Git Bash

# Enable Developer Mode
# Settings > Update & Security > For developers > Developer mode

# Install Windows Build Tools (if needed)
npm install -g windows-build-tools

# Set execution policy (if needed)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Run setup
./setup-environment.sh
```

### **macOS Setup** 🍎

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew
brew install node@18

# Run setup
chmod +x setup-environment.sh
./setup-environment.sh
```

### **Linux Setup** 🐧

```bash
# Update package manager
sudo apt update

# Install build essentials
sudo apt install -y build-essential python3-dev

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Run setup
chmod +x setup-environment.sh
./setup-environment.sh
```

## 🚫 **Common Errors & Solutions**

### **1. "Module not found" Errors**
```bash
# Solution
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npx expo install --fix
```

### **2. "Peer dependency" Warnings**
```bash
# Solution
npm install --legacy-peer-deps
```

### **3. "Metro bundler" Issues**
```bash
# Solution
npx expo start --clear
# or
npx react-native start --reset-cache
```

### **4. "Expo CLI not found"**
```bash
# Solution
npm uninstall -g expo-cli @expo/cli
npm install -g @expo/cli@latest
```

### **5. "Permission denied" (macOS/Linux)**
```bash
# Solution
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

### **6. "Network timeout" Errors**
```bash
# Solution
npm config set registry https://registry.npmjs.org/
npm config set fetch-timeout 600000
npm config set fetch-retry-mintimeout 10000
npm config set fetch-retry-maxtimeout 60000
```

## 📱 **Testing Your Setup**

### **Quick Test Commands**
```bash
# Check versions
node --version
npm --version
expo --version

# Verify critical packages
npm list expo
npm list react
npm list react-native

# Test Expo functionality
expo --help
```

### **Full App Test**
```bash
# Start the app
npm start

# Should see:
# ✅ Metro bundler running
# ✅ QR code displayed
# ✅ No error messages
# ✅ Can access via browser at localhost:19000
```

## 🎯 **Success Indicators**

### **✅ You're Ready When:**
- No error messages during `npm install`
- `npm start` opens Expo DevTools
- QR code is displayed
- Can scan QR code with Expo Go app
- App loads on your mobile device
- Camera and gallery features work

### **❌ Need to Fix When:**
- Red error messages during install
- `npm start` fails to start
- Metro bundler crashes
- QR code doesn't appear
- App crashes on mobile device

## 🆘 **Emergency Reset**

If everything fails, use this nuclear option:

```bash
# Complete reset
rm -rf node_modules package-lock.json yarn.lock .expo
npm cache clean --force
npm uninstall -g @expo/cli eas-cli
npm install -g @expo/cli@latest eas-cli@latest

# Fresh install
npm install --legacy-peer-deps
npx expo install --fix

# Start fresh
npx expo start --clear
```

## 📞 **Getting Help**

### **Before asking for help, provide:**
1. **Your OS**: Windows/macOS/Linux version
2. **Node.js version**: `node --version`
3. **npm version**: `npm --version`
4. **Expo version**: `expo --version`
5. **Full error message**: Copy-paste the complete error
6. **What you tried**: List the solutions you attempted

### **Useful debugging commands:**
```bash
# Environment info
npx expo doctor

# Package info
npm list --depth=0

# Cache info
npm cache verify

# Network info
npm config list
```

## 🎉 **Success!**

Once setup is complete, you should be able to:
- ✅ Run `npm start` without errors
- ✅ See QR code in terminal/browser
- ✅ Scan QR code with Expo Go app
- ✅ Use camera and gallery features
- ✅ Analyze cassava leaf images
- ✅ View batch results

**Your CassavaDoc mobile app is now ready for development and testing!** 🌿📱