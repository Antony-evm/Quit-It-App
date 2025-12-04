import { useWindowDimensions } from 'react-native';

import { AppText } from './AppText';
import { Box } from './Box';
import { SPACING, SpacingToken, TEXT } from '../../theme';

export type ScreenHeaderVariant = 'default' | 'paywall';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  variant?: ScreenHeaderVariant;
  withTopMargin?: boolean;
};

type VariantConfig = {
  align: 'left' | 'center' | 'right';
  marginBottom: number;
  gap: SpacingToken;
  paddingHorizontal?: number;
};

const VARIANTS: Record<ScreenHeaderVariant, VariantConfig> = {
  default: {
    marginBottom: SPACING.xxl,
    align: 'left',
    gap: 'md',
  },
  paywall: {
    marginBottom: SPACING.xl,
    align: 'center',
    gap: 'sm',
  },
};

export const ScreenHeader = ({
  title,
  subtitle,
  variant = 'default',
  withTopMargin = true,
}: ScreenHeaderProps) => {
  const { height } = useWindowDimensions();
  const topMargin = height * 0.05;
  const config = VARIANTS[variant];

  return (
    <Box
      style={[
        {
          marginBottom: config.marginBottom,
          marginTop: withTopMargin ? topMargin : 0,
        },
      ]}
      gap={config.gap}
    >
      <AppText variant="title">{title}</AppText>
      <AppText style={{ color: TEXT.subtitle }}>{subtitle}</AppText>
    </Box>
  );
};
