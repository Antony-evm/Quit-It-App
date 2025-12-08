import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  PanResponder,
} from 'react-native';
import { useStytch } from '@stytch/react-native';
import { useAuth } from '../../auth/AuthContext';
import AuthService from '../../auth/authService';
import { BACKGROUND, TEXT, SYSTEM, SCREEN_HEIGHT } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetNavigation } from '@/navigation/navigationRef';

interface DeveloperMenuProps {
  visible: boolean;
  onClose: () => void;
}

const DeveloperMenu: React.FC<DeveloperMenuProps> = ({ visible, onClose }) => {
  const { logout } = useAuth();
  const stytch = useStytch();
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // Slide down
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 8,
      }).start();
    } else {
      // Slide up
      Animated.timing(translateY, {
        toValue: -SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only allow upward swipes
        return gestureState.dy < -10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging upward
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged up more than 50 pixels, close the menu
        if (gestureState.dy < -50 || gestureState.vy < -0.5) {
          onClose();
        } else {
          // Otherwise, snap back to open position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  if (!visible) return null;

  const forceLogoutAndClearData = async () => {
    Alert.alert(
      'Force Logout & Clear Data',
      'This will log you out and clear all app data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all local storage
              await AsyncStorage.clear();

              // Perform logout (handles session revocation with error handling)
              await logout();

              // Navigate to auth
              resetNavigation('Auth', { mode: 'login' });

              onClose();
            } catch (error) {
              console.error('Force logout failed:', error);
              Alert.alert('Error', 'Force logout failed');
            }
          },
        },
      ],
    );
  };

  return (
    <>
      {/* Backdrop overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Draggable menu panel */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        <View style={styles.header}>
          <Text style={styles.title}>Developer Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={forceLogoutAndClearData}
          >
            <Text style={styles.dangerButtonText}>
              Force Logout & Clear Data
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9998,
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BACKGROUND.primary,
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: SYSTEM.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: SYSTEM.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BACKGROUND.muted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: TEXT.secondary,
    fontWeight: 'bold',
  },
  content: {
    paddingVertical: 8,
  },
  dangerButton: {
    backgroundColor: '#F44336',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default DeveloperMenu;
