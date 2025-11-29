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
import { SPACING, COLOR_PALETTE } from '@/shared/theme';
import { AppText } from '@/shared/components/ui';
import CancelSvg from '@/assets/cancel.svg';

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
                <CancelSvg
                  width={24}
                  height={24}
                  color={COLOR_PALETTE.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <AppText variant="heading" tone="primary">
              {title}
            </AppText>
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  drawer: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '85%',
    overflow: 'hidden',
  },
  headerContainer: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.sm,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING.lg,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  titleContainer: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 5,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
});
