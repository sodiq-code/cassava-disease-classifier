import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import ActionButton from '../components/ActionButton';
import { COLORS, DISEASE_INFO } from '../constants/diseaseData';
import { getHistory, clearHistory } from '../utils/storage';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all analysis history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            const success = await clearHistory();
            if (success) {
              setHistory([]);
              Alert.alert('Success', 'History cleared successfully');
            } else {
              Alert.alert('Error', 'Failed to clear history');
            }
          },
        },
      ]
    );
  };

  const viewResult = (result) => {
    if (result.type === 'batch') {
      navigation.navigate('BatchResult', { batchResult: result });
    } else {
      navigation.navigate('Result', { result });
    }
  };

  const renderSingleImageItem = (item) => {
    const diseaseInfo = DISEASE_INFO[item.className];
    const date = new Date(item.timestamp);
    
    return (
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
        <View style={styles.confidenceOverlay}>
          <Text style={styles.confidenceText}>
            {item.confidence.toFixed(0)}%
          </Text>
        </View>
      </View>
    );
  };

  const renderBatchImageItem = (item) => {
    const date = new Date(item.timestamp);
    const successfulResults = item.results.filter(r => !r.error);
    const totalImages = item.totalImages || item.imageUris.length;
    
    return (
      <View style={styles.batchImageContainer}>
        <View style={styles.batchImagesGrid}>
          {item.imageUris.slice(0, 4).map((imageUri, index) => (
            <Image 
              key={index} 
              source={{ uri: imageUri }} 
              style={styles.batchGridImage} 
            />
          ))}
          {totalImages > 4 && (
            <View style={styles.moreImagesOverlay}>
              <Text style={styles.moreImagesText}>+{totalImages - 4}</Text>
            </View>
          )}
        </View>
        <View style={styles.batchStatsOverlay}>
          <Text style={styles.batchStatsText}>
            {successfulResults.length}/{totalImages}
          </Text>
        </View>
      </View>
    );
  };

  const renderHistoryItem = ({ item }) => {
    const date = new Date(item.timestamp);
    const isBatch = item.type === 'batch';
    
    return (
      <TouchableOpacity 
        style={[styles.historyItem, isBatch && styles.batchHistoryItem]}
        onPress={() => viewResult(item)}
        activeOpacity={0.7}
      >
        {isBatch ? renderBatchImageItem(item) : renderSingleImageItem(item)}
        
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            {isBatch ? (
              <>
                <Text style={styles.itemIcon}>🖼️</Text>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    Batch Analysis ({item.totalImages || item.imageUris.length} images)
                  </Text>
                  <View style={styles.batchBadge}>
                    <Text style={styles.batchBadgeText}>
                      {item.results.filter(r => !r.error).length} successful
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.itemIcon}>{DISEASE_INFO[item.className]?.icon}</Text>
                <View style={styles.itemTitleContainer}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.className}
                  </Text>
                  <View 
                    style={[
                      styles.severityBadge,
                      { backgroundColor: `${DISEASE_INFO[item.className]?.color}20` }
                    ]}
                  >
                    <Text 
                      style={[
                        styles.severityText,
                        { color: DISEASE_INFO[item.className]?.color }
                      ]}
                    >
                      {DISEASE_INFO[item.className]?.severity}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>
          
          <View style={styles.itemFooter}>
            <View style={styles.itemFooterLeft}>
              <Text style={styles.itemDate}>
                {date.toLocaleDateString()} • {date.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
              <Text style={styles.analysisMode}>
                {item.isFromAPI ? '🌐 Online' : '📱 Offline'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📂</Text>
      <Text style={styles.emptyTitle}>No Analysis History</Text>
      <Text style={styles.emptySubtitle}>
        Your previous disease analyses will appear here
      </Text>
      <ActionButton
        title="Analyze First Image"
        icon="🔍"
        onPress={() => navigation.navigate('Home')}
        style={styles.emptyButton}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analysis History</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} {history.length === 1 ? 'analysis' : 'analyses'} saved
        </Text>
      </View>

      {history.length > 0 && (
        <View style={styles.actionBar}>
          <ActionButton
            title="Clear All"
            icon="🗑️"
            onPress={clearAllHistory}
            variant="secondary"
            style={styles.clearButton}
          />
        </View>
      )}

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          history.length === 0 && styles.emptyListContainer
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clearButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  batchHistoryItem: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  confidenceOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(22, 163, 74, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  batchImageContainer: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  batchImagesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  batchGridImage: {
    width: '50%',
    height: '50%',
    resizeMode: 'cover',
    borderWidth: 0.5,
    borderColor: '#ffffff',
  },
  moreImagesOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  batchStatsOverlay: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  batchStatsText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  itemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  batchBadge: {
    backgroundColor: `${COLORS.secondary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  batchBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemFooterLeft: {
    flex: 1,
  },
  itemDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  analysisMode: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    minWidth: 200,
  },
});

export default HistoryScreen;