import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@cassava_history';

export const saveToHistory = async (analysisResult) => {
  try {
    const existingHistory = await getHistory();
    const newHistory = [analysisResult, ...existingHistory.slice(0, 49)]; // Keep last 50 results
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
};

export const getHistory = async () => {
  try {
    const historyString = await AsyncStorage.getItem(HISTORY_KEY);
    return historyString ? JSON.parse(historyString) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};