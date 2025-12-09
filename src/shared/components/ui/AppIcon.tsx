import React from 'react';
import { SvgProps } from 'react-native-svg';
import { BACKGROUND, TEXT, ICON_SIZES } from '@/shared/theme';

export type IconVariant =
  | 'default'
  | 'fab'
  | 'inverse'
  | 'backArrow'
  | 'small'
  | 'logo';

interface VariantStyle {
  size: number;
  color?: string;
  stroke?: string;
  strokeWidth?: number;
}

const BASE_SIZES = {
  small: { size: ICON_SIZES.small, strokeWidth: 1.5 },
  medium: { size: ICON_SIZES.medium, strokeWidth: 2 },
  large: { size: ICON_SIZES.large, strokeWidth: 2.5 },
  xlarge: { size: ICON_SIZES.xlarge },
  jumbo: { size: ICON_SIZES.jumbo },
};

const BASE_THEMES = {
  primary: { color: BACKGROUND.primary, stroke: TEXT.primary },
  inverse: { color: TEXT.primary, stroke: BACKGROUND.primary },
  muted: { color: BACKGROUND.primary, stroke: TEXT.muted },
};

const VARIANTS: Record<IconVariant, VariantStyle> = {
  default: { ...BASE_SIZES.medium, ...BASE_THEMES.primary },
  backArrow: { ...BASE_SIZES.medium, ...BASE_THEMES.inverse },
  inverse: { ...BASE_SIZES.large, ...BASE_THEMES.inverse, strokeWidth: 2 },
  fab: { ...BASE_SIZES.xlarge, color: BACKGROUND.muted },
  small: { ...BASE_SIZES.small, ...BASE_THEMES.muted },
  logo: { ...BASE_SIZES.jumbo },
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

  const iconProps: SvgProps = {
    width: theme.size,
    height: theme.size,
    style,
    ...rest,
  };

  if (theme.color) {
    iconProps.fill = theme.color;
  }

  if (iconStroke) {
    iconProps.stroke = iconStroke;
    iconProps.color = iconStroke;
  }

  if (theme.strokeWidth) {
    iconProps.strokeWidth = theme.strokeWidth;
  }

  if (fillOpacity !== undefined) {
    iconProps.fillOpacity = fillOpacity;
  }

  if (strokeOpacity !== undefined) {
    iconProps.strokeOpacity = strokeOpacity;
  }

  return <Icon {...iconProps} />;
};
