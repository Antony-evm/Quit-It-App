import React from 'react';
import { SvgProps } from 'react-native-svg';
import { COLOR_PALETTE, ICON_SIZES } from '@/shared/theme';

export type IconVariant =
  | 'default'
  | 'small'
  | 'large'
  | 'muted'
  | 'accent'
  | 'error'
  | 'inverse';

const VARIANTS = {
  default: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.textPrimary,
  },
  small: {
    size: ICON_SIZES.small,
    color: COLOR_PALETTE.textPrimary,
  },
  large: {
    size: ICON_SIZES.large,
    color: COLOR_PALETTE.textPrimary,
  },
  muted: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.textMuted,
  },
  accent: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.accentPrimary,
  },
  error: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.systemError,
  },
  inverse: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.textInverse,
  },
} as const;

export interface AppIconProps extends Omit<SvgProps, 'width' | 'height'> {
  icon: React.FC<SvgProps>;
  variant?: IconVariant;
  color?: string;
  width?: number;
  height?: number;
}

export const AppIcon = ({
  icon: Icon,
  variant = 'default',
  color,
  style,
  width,
  height,
  ...props
}: AppIconProps) => {
  const { size, color: defaultColor } = VARIANTS[variant];
  const finalColor = color || defaultColor;

  return (
    <Icon
      width={width || size}
      height={height || size}
      fill={finalColor}
      style={style}
      {...props}
    />
  );
};
