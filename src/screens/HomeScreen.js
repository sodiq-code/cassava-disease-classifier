import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import ActionButton from '../components/ActionButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { COLORS, PHOTOGRAPHY_TIPS } from '../constants/diseaseData';
import { predictImage, detectAnomaly, predictMultipleImages } from '../utils/imageProcessing';
import { saveToHistory } from '../utils/storage';

const HomeScreen = ({ navigation }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Check for anomalies (basic check, API will do detailed check)
      const anomalyCheck = await detectAnomaly(imageUri);
      if (!anomalyCheck.isValid) {
        Alert.alert(
          'Invalid Image',
          anomalyCheck.reason,
          [{ text: 'OK', style: 'default' }]
        );
        setIsAnalyzing(false);
        return;
      }

      // Predict disease using backend API
      const prediction = await predictImage(imageUri);
      
      if (prediction.confidence < 60) {
        Alert.alert(
          'Low Confidence',
          `Prediction confidence: ${prediction.confidence.toFixed(1)}%. Please try with a clearer image.${!prediction.isFromAPI ? '\n\n⚠️ Using offline mode - connect to internet for better accuracy.' : ''}`,
          [{ text: 'OK', style: 'default' }]
        );
        setIsAnalyzing(false);
        return;
      }

      // Save to history
      const analysisResult = {
        id: Date.now().toString(),
        imageUri,
        className: prediction.className,
        confidence: prediction.confidence,
        timestamp: new Date().toISOString(),
        isFromAPI: prediction.isFromAPI || false,
      };

      await saveToHistory(analysisResult);

      // Navigate to results
      navigation.navigate('Result', { result: analysisResult });

    } catch (error) {
      const errorMessage = error.message.includes('Insufficient vegetation') || 
                          error.message.includes('Anomaly') ||
                          error.message.includes('detected')
        ? error.message
        : 'An error occurred while analyzing the image. Please try again.';
      
      Alert.alert(
        'Analysis Error',
        errorMessage,
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeMultipleImages = async (imageUris) => {
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Process multiple images
      const results = await predictMultipleImages(imageUris);
      
      // Create batch analysis result
      const batchResult = {
        id: Date.now().toString(),
        type: 'batch',
        imageUris,
        results: results.results,
        timestamp: new Date().toISOString(),
        isFromAPI: results.isFromAPI || false,
        totalImages: imageUris.length,
      };

      // Save batch to history
      await saveToHistory(batchResult);

      // Navigate to batch results
      navigation.navigate('BatchResult', { batchResult });

    } catch (error) {
      Alert.alert(
        'Batch Analysis Error',
        'An error occurred while analyzing the images. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pickSingleImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await analyzeImage(result.assets[0].uri);
    }
  };

  const pickMultipleImagesFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to select images.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10, // Limit to 10 images for performance
      quality: 0.8,
      aspect: [1, 1],
      allowsEditing: false, // Disable editing for multiple selection
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (result.assets.length === 1) {
        // Single image selected, use regular analysis
        await analyzeImage(result.assets[0].uri);
      } else {
        // Multiple images selected, use batch analysis
        const imageUris = result.assets.map(asset => asset.uri);
        await analyzeMultipleImages(imageUris);
      }
    }
  };

  const showGalleryOptions = () => {
    Alert.alert(
      'Select Images',
      'Choose how many images you want to analyze',
      [
        {
          text: 'Single Image',
          onPress: pickSingleImageFromGallery,
          style: 'default'
        },
        {
          text: 'Multiple Images',
          onPress: pickMultipleImagesFromGallery,
          style: 'default'
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const openCamera = () => {
    navigation.navigate('Camera', { onImageCaptured: analyzeImage });
  };

  const viewHistory = () => {
    navigation.navigate('History');
  };

  if (isAnalyzing) {
    return <LoadingSpinner message="Processing your cassava leaf images..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.heroTitle}>AI-Powered Disease Detection</Text>
            <Text style={styles.heroSubtitle}>
              Get instant diagnosis of cassava leaf diseases using advanced machine learning
            </Text>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <ActionButton
            title="Take Photo"
            icon="📷"
            onPress={openCamera}
            style={styles.actionButton}
          />
          
          <ActionButton
            title="Choose from Gallery"
            icon="📁"
            onPress={showGalleryOptions}
            style={styles.actionButton}
          />
          
          <ActionButton
            title="View History"
            icon="📂"
            onPress={viewHistory}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        {/* New Features Info */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🖼️</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Multiple Image Analysis</Text>
              <Text style={styles.featureText}>Select and analyze up to 10 images at once</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Batch Processing</Text>
              <Text style={styles.featureText}>Get results for all images simultaneously</Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsIcon}>💡</Text>
            <Text style={styles.tipsTitle}>Photography Tips</Text>
          </View>
          <View style={styles.tipsContainer}>
            {PHOTOGRAPHY_TIPS.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How it works</Text>
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Capture or select images of cassava leaves</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Our AI analyzes all images for disease symptoms</Text>
            </View>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Get instant diagnosis with treatment recommendations</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    padding: 16,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  featuresSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  tipsSection: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0369a1',
  },
  tipsContainer: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    color: '#0369a1',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
  },
  infoSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  stepContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginTop: 6,
  },
});

export default HomeScreen;