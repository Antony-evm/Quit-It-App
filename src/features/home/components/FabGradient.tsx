import React from 'react';
import { StyleSheet } from 'react-native';
import { Svg, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { COLOR_PALETTE } from '@/shared/theme';

export const FabGradient = () => {
  return (
    <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient
          id="grad"
          cx="50%"
          cy="50%"
          rx="50%"
          ry="50%"
          fx="50%"
          fy="50%"
        >
          <Stop
            offset="0"
            stopColor={COLOR_PALETTE.brandPrimary}
            stopOpacity="1"
          />
          <Stop
            offset="1"
            stopColor={COLOR_PALETTE.backgroundPrimary}
            stopOpacity="1"
          />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#grad)" />
    </Svg>
  );
};
