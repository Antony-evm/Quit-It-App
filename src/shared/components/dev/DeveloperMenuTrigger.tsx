import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLOR_PALETTE } from '../../theme';
import DeveloperMenu from './DeveloperMenu';

const DeveloperMenuTrigger: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTap = () => {
    // Animate the button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Handle multiple taps to open dev menu (like Instagram's debug menu)
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
    }

    if (newTapCount >= 5) {
      // Open developer menu after 5 taps
      console.log('[DevMenuTrigger] Opening developer menu after 5 taps');
      setMenuVisible(true);
      setTapCount(0);
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }
    } else {
      // Reset tap count after 2 seconds of no taps
      console.log(`[DevMenuTrigger] Tap ${newTapCount}/5 registered`);
      tapTimer.current = setTimeout(() => {
        setTapCount(0);
        console.log('[DevMenuTrigger] Tap count reset');
      }, 2000);
    }
  };

  return (
    <>
      <Animated.View
        style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          style={styles.trigger}
          onPress={handleTap}
          activeOpacity={0.7}
        >
          <Text style={styles.triggerText}>DEV</Text>
          {tapCount > 0 && <Text style={styles.tapCounter}>{tapCount}/5</Text>}
        </TouchableOpacity>
      </Animated.View>

      <DeveloperMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 9998,
  },
  trigger: {
    backgroundColor: COLOR_PALETTE.accentMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerText: {
    color: COLOR_PALETTE.textSecondary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tapCounter: {
    color: COLOR_PALETTE.systemError,
    fontSize: 8,
    fontWeight: 'bold',
    marginTop: 1,
  },
});

export default DeveloperMenuTrigger;
