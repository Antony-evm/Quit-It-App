import React from 'react';
import { SvgProps } from 'react-native-svg';
import { BACKGROUND, TEXT, SYSTEM, ICON_SIZES } from '@/shared/theme';

export type IconVariant =
  | 'default'
  | 'small'
  | 'large'
  | 'muted'
  | 'accent'
  | 'error'
  | 'fab'
  | 'inverse'
  | 'backArrow';

const VARIANTS = {
  default: {
    size: ICON_SIZES.medium,
    color: BACKGROUND.primary,
    stroke: TEXT.primary,
  },
  backArrow: {
    size: ICON_SIZES.medium,
    color: TEXT.primary,
    stroke: BACKGROUND.primary,
  },
  inverse: {
    size: ICON_SIZES.large,
    color: TEXT.primary,
    stroke: BACKGROUND.primary,
  },
  fab: {
    size: ICON_SIZES.xlarge,
    color: BACKGROUND.dark,
  },
  small: {
    size: ICON_SIZES.small,
    color: BACKGROUND.primary,
    stroke: TEXT.primary,
  },
  large: {
    size: ICON_SIZES.large,
    color: BACKGROUND.primary,
    stroke: TEXT.primary,
  },
  muted: {
    size: ICON_SIZES.medium,
    color: TEXT.muted,
  },
  accent: {
    size: ICON_SIZES.medium,
    color: SYSTEM.accentPrimary,
  },
  error: {
    size: ICON_SIZES.medium,
    color: SYSTEM.error,
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
