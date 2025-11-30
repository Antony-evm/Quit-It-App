import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

import {
  SPACING,
  SpacingToken,
  COLOR_PALETTE,
  BORDER_RADIUS,
  BorderRadiusToken,
  OPACITY,
} from '../../theme';

export type SkeletonBoxProps = {
  /** Width of the skeleton - can be number or percentage string */
  width?: number | `${number}%`;
  /** Height of the skeleton */
  height: number;
  /** Border radius from theme tokens */
  borderRadius?: BorderRadiusToken;
  /** Margin bottom */
  mb?: SpacingToken;
  /** Margin top */
  mt?: SpacingToken;
  /** Enable shimmer animation */
  animated?: boolean;
  /** Additional styles */
  style?: StyleProp<ViewStyle>;
};

export const SkeletonBox = React.memo(
  ({
    width = '100%',
    height,
    borderRadius = 'small',
    mb,
    mt,
    animated = true,
    style,
  }: SkeletonBoxProps) => {
    const opacity = useRef(new Animated.Value(OPACITY.skeleton)).current;

    useEffect(() => {
      if (!animated) return;

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: OPACITY.skeleton + 0.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: OPACITY.skeleton,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );

      animation.start();

      return () => animation.stop();
    }, [animated, opacity]);

    const skeletonStyle: ViewStyle = {
      width,
      height,
      backgroundColor: COLOR_PALETTE.borderDefault,
      borderRadius: BORDER_RADIUS[borderRadius],
      ...(mb !== undefined && { marginBottom: SPACING[mb] }),
      ...(mt !== undefined && { marginTop: SPACING[mt] }),
    };

    return <Animated.View style={[skeletonStyle, { opacity }, style]} />;
  },
);
