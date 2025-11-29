import React from 'react';
import { StyleSheet, ViewStyle, Image } from 'react-native';
import { Box } from './Box';
import { COLOR_PALETTE } from '../../theme';

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
    <Box alignItems="center" justifyContent="center" style={style}>
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
    </Box>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    shadowColor: COLOR_PALETTE.textSecondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
