import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Toast as ToastType, useToast } from './ToastContext';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { AppPressable } from '../ui';

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { hideToast } = useToast();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  const handleDismiss = () => {
    animateOut(() => {
      hideToast(toast.id);
    });
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          backgroundColor: COLOR_PALETTE.systemSuccess,
          borderColor: COLOR_PALETTE.systemSuccessDark,
        };
      case 'error':
        return {
          backgroundColor: COLOR_PALETTE.systemError,
          borderColor: COLOR_PALETTE.systemErrorDark,
        };
      default:
        return {
          backgroundColor: COLOR_PALETTE.backgroundPrimary,
          borderColor: COLOR_PALETTE.borderDefault,
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyles(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <AppPressable variant="toast" onPress={handleDismiss} fullWidth>
        <Text style={styles.toastText}>{toast.message}</Text>
        <Text style={styles.dismissHint}>Tap to dismiss</Text>
      </AppPressable>
    </Animated.View>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { top: insets.top + SPACING.sm }]}>
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
    elevation: 9999,
  },
  toastContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SPACING.xs,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: COLOR_PALETTE.textInverse,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  dismissHint: {
    color: COLOR_PALETTE.textInverse,
    fontSize: 12,
    opacity: 0.8,
    textAlign: 'center',
  },
});
