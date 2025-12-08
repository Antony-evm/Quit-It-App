import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, PanResponder } from 'react-native';
import DeveloperMenu from './DeveloperMenu';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const TRIGGER_ZONE_HEIGHT = SCREEN_HEIGHT * 0.1; // Top 10% of screen
const HOLD_DURATION = 2000; // 2 seconds

const DeveloperMenuTrigger: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to touches in the top 10% of the screen
        return evt.nativeEvent.pageY <= TRIGGER_ZONE_HEIGHT;
      },
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: (evt, gestureState) => {
        // Start the hold timer when touch begins in trigger zone
        if (evt.nativeEvent.pageY <= TRIGGER_ZONE_HEIGHT) {
          console.log('🔧 Hold started in trigger zone');
          holdTimer.current = setTimeout(() => {
            console.log('🔧 Opening developer menu after 2s hold');
            setMenuVisible(true);
          }, HOLD_DURATION);
        }
      },
      onPanResponderRelease: () => {
        // Cancel timer if touch is released before 2 seconds
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
      },
      onPanResponderTerminate: () => {
        // Cancel timer if gesture is interrupted
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
      },
    }),
  ).current;

  return (
    <>
      <View style={styles.triggerZone} {...panResponder.panHandlers} />
      <DeveloperMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  triggerZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: TRIGGER_ZONE_HEIGHT,
    zIndex: 9998,
    // Invisible but touchable
    backgroundColor: 'transparent',
  },
});

export default DeveloperMenuTrigger;
