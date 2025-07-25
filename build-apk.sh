#!/bin/bash

echo "🏗️  CassavaDoc APK Builder"
echo "========================="

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📱 Installing EAS CLI..."
    npm install -g eas-cli
fi

echo "✅ EAS CLI is ready"

# Check if user is logged in
if ! eas whoami &> /dev/null; then
    echo "🔐 Please login to your Expo account:"
    eas login
fi

echo "✅ Logged in to Expo"

# Configure EAS build if not already configured
if [ ! -f "eas.json" ]; then
    echo "⚙️  Configuring EAS build..."
    eas build:configure
fi

echo "🏗️  Building APK..."
echo "   This may take 10-15 minutes..."
echo ""

# Build APK for Android
eas build --platform android --profile preview

echo ""
echo "✅ Build completed!"
echo "📱 Download your APK from the link above"
echo "💡 You can also find it in your Expo dashboard"
echo ""
echo "📋 To install on Android device:"
echo "   1. Download the APK file"
echo "   2. Enable 'Install from unknown sources' in Android settings"
echo "   3. Install the APK file"