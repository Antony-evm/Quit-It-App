import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  PanResponder,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SPACING, BACKGROUND, SYSTEM, OPACITY } from '@/shared/theme';

// React Native exposes requestIdleCallback globally
declare const requestIdleCallback: (callback: () => void) => number;
declare const cancelIdleCallback: (id: number) => void;

type DraggableModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  indicatorStyle?: StyleProp<ViewStyle>;
};

export const DraggableModal = ({
  visible,
  onClose,
  children,
  headerContent,
  indicatorStyle,
}: DraggableModalProps) => {
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isContentVisible, setIsContentVisible] = useState(visible);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.timing(panY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      panY.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }),
        Animated.timing(backdropOpacity, {
          toValue: OPACITY.medium,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const idleCallbackId = requestIdleCallback(() => {
        setIsContentVisible(true);
      });

      return () => cancelIdleCallback(idleCallbackId);
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsContentVisible(false);
      });
    }
  }, [visible, slideAnim, panY, screenHeight, backdropOpacity]);

  const translateY = Animated.add(slideAnim, panY);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[styles.backdrop, { opacity: backdropOpacity }]}
          />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.drawer, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers} style={styles.headerContainer}>
            <View style={styles.indicatorContainer}>
              <View style={[styles.indicator, indicatorStyle]} />
            </View>
            {headerContent && (
              <View style={styles.headerContent}>{headerContent}</View>
            )}
          </View>
          <View style={styles.content}>
            {isContentVisible ? children : null}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SYSTEM.shadow,
    zIndex: 1,
  },
  drawer: {
    backgroundColor: BACKGROUND.muted,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    overflow: 'hidden',
    zIndex: 2,
  },
  headerContainer: {
    backgroundColor: BACKGROUND.pressed,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: SYSTEM.border,
    zIndex: 10,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  indicator: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SYSTEM.brand,
    opacity: OPACITY.medium,
  },
  headerContent: {
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flex: 1,
  },
});
