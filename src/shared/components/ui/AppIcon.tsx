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
  | 'fab'
  | 'inverse';

const VARIANTS = {
  default: {
    size: ICON_SIZES.medium,
    color: COLOR_PALETTE.backgroundPrimary,
    stroke: COLOR_PALETTE.textPrimary,
  },
  inverse: {
    size: ICON_SIZES.large,
    color: COLOR_PALETTE.textPrimary,
    stroke: COLOR_PALETTE.backgroundPrimary,
  },
  fab: {
    size: ICON_SIZES.xlarge,
    color: COLOR_PALETTE.backgroundDark,
  },
  small: {
    size: ICON_SIZES.small,
    color: COLOR_PALETTE.backgroundPrimary,
    stroke: COLOR_PALETTE.textPrimary,
  },
  large: {
    size: ICON_SIZES.large,
    color: COLOR_PALETTE.backgroundPrimary,
    stroke: COLOR_PALETTE.textPrimary,
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
  const {
    size,
    color: defaultColor,
    stroke: defaultStroke,
  } = VARIANTS[variant] as { size: number; color: string; stroke?: string };
  const finalColor = color || defaultColor;
  const finalStroke = defaultStroke || finalColor;

  return (
    <Icon
      width={width || size}
      height={height || size}
      fill={finalColor}
      stroke={finalStroke}
      color={finalStroke}
      style={style}
      {...props}
    />
  );
};
