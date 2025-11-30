import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { SYSTEM } from '../../theme';
import DeveloperMenu from './DeveloperMenu';

const DeveloperMenuTrigger: React.FC = () => {
  console.log('🔧 DeveloperMenuTrigger rendered - __DEV__ =', __DEV__);

  const [menuVisible, setMenuVisible] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleTap = () => {
    console.log('🔧 DEV BUTTON TAPPED - Tap count:', tapCount + 1);

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
      console.log('🔧 OPENING DEVELOPER MENU');
      setMenuVisible(true);
      setTapCount(0);
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }
    } else {
      // Reset tap count after 2 seconds of no taps
      tapTimer.current = setTimeout(() => {
        setTapCount(0);
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
          onLongPress={() => {
            console.log('🔧 LONG PRESS - Opening menu directly');
            setMenuVisible(true);
          }}
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
    // Make more visible for debugging
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // Temporary red background
  },
  trigger: {
    backgroundColor: SYSTEM.accentMuted,
    paddingHorizontal: 12, // Increased padding
    paddingVertical: 8, // Increased padding
    borderRadius: 8,
    borderWidth: 2, // Thicker border
    borderColor: '#FF0000', // Red border for visibility
    minWidth: 50, // Larger minimum width
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerText: {
    color: '#000000', // Black text for better visibility
    fontSize: 12, // Larger font
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  tapCounter: {
    color: '#FF0000', // Red counter
    fontSize: 10, // Larger counter
    fontWeight: 'bold',
    marginTop: 1,
  },
});

export default DeveloperMenuTrigger;
