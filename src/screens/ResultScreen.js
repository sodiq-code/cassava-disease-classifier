import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import ActionButton from '../components/ActionButton';
import { COLORS, DISEASE_INFO } from '../constants/diseaseData';

const ResultScreen = ({ navigation, route }) => {
  const { result } = route.params;
  const diseaseInfo = DISEASE_INFO[result.className];

  const shareResult = async () => {
    try {
      const message = `CassavaDoc Analysis Result:
      
Disease: ${result.className}
Confidence: ${result.confidence.toFixed(1)}%
Severity: ${diseaseInfo.severity}
Description: ${diseaseInfo.description}
Treatment: ${diseaseInfo.treatment}

Analyzed on: ${new Date(result.timestamp).toLocaleDateString()}

#CassavaDoc #PlantDisease #Agriculture`;

      await Share.share({
        message,
        title: 'CassavaDoc Analysis Result',
      });
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      Alert.alert('Share Error', 'Unable to share result');
    }
  };

  const analyzeAnother = () => {
    navigation.navigate('Home');
  };

  const viewHistory = () => {
    navigation.navigate('History');
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high': return COLORS.error;
      case 'medium': return COLORS.warning;
      case 'none': return COLORS.success;
      default: return COLORS.textSecondary;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return COLORS.success;
    if (confidence >= 60) return COLORS.warning;
    return COLORS.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Result Header */}
        <View style={styles.headerSection}>
          <LinearGradient
            colors={[diseaseInfo.color, `${diseaseInfo.color}CC`]}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.headerIcon}>{diseaseInfo.icon}</Text>
            <Text style={styles.headerTitle}>{result.className}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>
                {result.confidence.toFixed(1)}% Confidence
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Image Display */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: result.imageUri }} style={styles.resultImage} />
            <View style={styles.imageOverlay}>
              <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
                <Ionicons name="share-outline" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Disease Information */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>Disease Information</Text>
              <View 
                style={[
                  styles.severityBadge, 
                  { backgroundColor: `${getSeverityColor(diseaseInfo.severity)}20` }
                ]}
              >
                <Text 
                  style={[
                    styles.severityText, 
                    { color: getSeverityColor(diseaseInfo.severity) }
                  ]}
                >
                  {diseaseInfo.severity} Severity
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Description</Text>
              <Text style={styles.infoValue}>{diseaseInfo.description}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Recommended Treatment</Text>
              <Text style={styles.infoValue}>{diseaseInfo.treatment}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Analysis Date</Text>
              <Text style={styles.infoValue}>
                {new Date(result.timestamp).toLocaleString()}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Analysis Mode</Text>
              <Text style={[
                styles.infoValue,
                { 
                  color: result.isFromAPI ? COLORS.success : COLORS.warning,
                  fontWeight: '600'
                }
              ]}>
                {result.isFromAPI ? '🌐 Online (API)' : '📱 Offline (Local)'}
              </Text>
            </View>
          </View>
        </View>

        {/* Confidence Meter */}
        <View style={styles.confidenceSection}>
          <Text style={styles.sectionTitle}>Confidence Level</Text>
          <View style={styles.confidenceMeter}>
            <View style={styles.confidenceTrack}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { 
                    width: `${result.confidence}%`,
                    backgroundColor: getConfidenceColor(result.confidence)
                  }
                ]} 
              />
            </View>
            <Text 
              style={[
                styles.confidenceValue,
                { color: getConfidenceColor(result.confidence) }
              ]}
            >
              {result.confidence.toFixed(1)}%
            </Text>
          </View>
          
          <View style={styles.confidenceLabels}>
            <Text style={styles.confidenceLabel}>Low</Text>
            <Text style={styles.confidenceLabel}>High</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <ActionButton
            title="Analyze Another Image"
            icon="🔍"
            onPress={analyzeAnother}
            style={styles.actionButton}
          />
          
          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={shareResult}>
              <Ionicons name="share-outline" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={viewHistory}>
              <Ionicons name="time-outline" size={20} color={COLORS.primary} />
              <Text style={styles.secondaryButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Tips */}
        {diseaseInfo.severity !== 'None' && (
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Text style={styles.tipsIcon}>💡</Text>
              <Text style={styles.tipsTitle}>Additional Tips</Text>
            </View>
            <View style={styles.tipsContent}>
              <Text style={styles.tipText}>
                • Monitor other plants for similar symptoms
              </Text>
              <Text style={styles.tipText}>
                • Consider consulting with agricultural experts
              </Text>
              <Text style={styles.tipText}>
                • Keep affected plants isolated if possible
              </Text>
              <Text style={styles.tipText}>
                • Document the progression with photos
              </Text>
            </View>
          </View>
        )}
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
  headerSection: {
    marginBottom: 20,
  },
  headerGradient: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  resultImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
  },
  confidenceSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  confidenceMeter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'right',
  },
  confidenceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confidenceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionSection: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 16,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 100,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  tipsSection: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea580c',
  },
  tipsContent: {
    gap: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#ea580c',
    lineHeight: 20,
  },
});

export default ResultScreen;