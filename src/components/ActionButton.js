import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/diseaseData';

const ActionButton = ({ 
  title, 
  onPress, 
  icon, 
  variant = 'primary', 
  disabled = false,
  style = {}
}) => {
  if (variant === 'primary') {
    return (
      <TouchableOpacity 
        style={[styles.container, style]} 
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={disabled ? ['#9ca3af', '#9ca3af'] : [COLORS.primary, COLORS.secondary]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={[styles.text, styles.primaryText]}>{title}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.container, styles.secondaryContainer, style]} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={[styles.text, styles.secondaryText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradient: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  secondaryContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: COLORS.text,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
});

export default ActionButton;