import React from 'react';
import { SvgProps } from 'react-native-svg';
import { BACKGROUND, TEXT, ICON_SIZES } from '@/shared/theme';

export type IconVariant = 'default' | 'fab' | 'inverse' | 'backArrow';

interface VariantStyle {
  size: number;
  color: string;
  stroke?: string;
  strokeWidth?: number;
}

const BASE_SIZES = {
  medium: { size: ICON_SIZES.medium, strokeWidth: 2 },
  large: { size: ICON_SIZES.large, strokeWidth: 2.5 },
  xlarge: { size: ICON_SIZES.xlarge },
};

const BASE_THEMES = {
  primary: { color: BACKGROUND.primary, stroke: TEXT.primary },
  inverse: { color: TEXT.primary, stroke: BACKGROUND.primary },
};

const VARIANTS: Record<IconVariant, VariantStyle> = {
  default: { ...BASE_SIZES.medium, ...BASE_THEMES.primary },
  backArrow: { ...BASE_SIZES.medium, ...BASE_THEMES.inverse },
  inverse: { ...BASE_SIZES.large, ...BASE_THEMES.inverse, strokeWidth: 2 },
  fab: { ...BASE_SIZES.xlarge, color: BACKGROUND.dark },
};

export interface AppIconProps
  extends Omit<SvgProps, 'width' | 'height' | 'color'> {
  icon: React.FC<SvgProps>;
  variant?: IconVariant;
}

export const AppIcon = ({
  icon: Icon,
  variant = 'default',
  style,
  fillOpacity,
  strokeOpacity,
  ...rest
}: AppIconProps) => {
  const theme = VARIANTS[variant];
  const iconStroke = theme.stroke ?? theme.color;

  return (
    <Icon
      width={theme.size}
      height={theme.size}
      fill={theme.color}
      fillOpacity={fillOpacity}
      strokeOpacity={strokeOpacity}
      stroke={iconStroke}
      strokeWidth={theme.strokeWidth}
      color={iconStroke}
      style={style}
      {...rest}
    />
  );
};
