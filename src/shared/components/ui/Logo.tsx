import React from 'react';
import { View, StyleSheet, ViewStyle, Image } from 'react-native';
import { BRAND_COLORS, SPACING } from '../../theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const sizeConfig = {
  small: {
    imageSize: 60,
  },
  medium: {
    imageSize: 80,
  },
  large: {
    imageSize: 100,
  },
};

export const Logo: React.FC<LogoProps> = ({ size = 'large', style }) => {
  const config = sizeConfig[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../../../assets/logo.png')}
        style={[
          styles.logoImage,
          {
            width: config.imageSize,
            height: config.imageSize,
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    shadowColor: BRAND_COLORS.ink,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
