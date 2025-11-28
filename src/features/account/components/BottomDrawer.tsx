import React, { useEffect, useRef } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  PanResponder,
} from 'react-native';
import { BRAND_COLORS, SPACING, COLOR_PALETTE } from '@/shared/theme';
import { AppText } from '@/shared/components/ui';

type BottomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const BottomDrawer = ({
  visible,
  onClose,
  title,
  children,
}: BottomDrawerProps) => {
  const screenHeight = Dimensions.get('window').height;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const panY = useRef(new Animated.Value(0)).current;

  const resetPosition = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  });

  const closeAnimation = Animated.timing(slideAnim, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

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
          resetPosition.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (visible) {
      panY.setValue(0);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    } else {
      closeAnimation.start();
    }
  }, [visible, slideAnim, panY, closeAnimation]);

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
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View style={[styles.drawer, { transform: [{ translateY }] }]}>
          <View {...panResponder.panHandlers} style={styles.headerContainer}>
            <View style={styles.indicatorContainer}>
              <View style={styles.indicator} />
            </View>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <AppText tone="primary">Close</AppText>
              </TouchableOpacity>
              <View style={styles.titleContainer}>
                <AppText variant="heading" tone="primary">
                  {title}
                </AppText>
              </View>
              <View style={styles.placeholderButton} />
            </View>
          </View>
          <ScrollView style={styles.content}>{children}</ScrollView>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BRAND_COLORS.dark,
    opacity: 0.5,
  },
  drawer: {
    backgroundColor: BRAND_COLORS.ink,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    overflow: 'hidden',
  },
  headerContainer: {
    backgroundColor: BRAND_COLORS.dark,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLOR_PALETTE.textMuted,
    opacity: 0.5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    zIndex: 1,
    padding: SPACING.xs,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  placeholderButton: {
    width: 40, // Approximate width of "Close" button to balance layout if needed, though absolute positioning handles title centering
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
});
