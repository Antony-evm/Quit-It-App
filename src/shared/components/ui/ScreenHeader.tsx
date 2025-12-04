import { Dimensions } from 'react-native';

import { AppText } from './AppText';
import { Box } from './Box';
import { SPACING, SpacingToken, TEXT } from '../../theme';

const { height } = Dimensions.get('window');
const TOP_MARGIN = height * 0.05;

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
    marginBottom: SPACING.md,
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
  const config = VARIANTS[variant];

  return (
    <Box
      style={[
        {
          marginBottom: config.marginBottom,
          marginTop: withTopMargin ? TOP_MARGIN : 0,
        },
      ]}
      gap={config.gap}
    >
      <AppText variant="title">{title}</AppText>
      <AppText style={{ color: TEXT.subtitle }}>{subtitle}</AppText>
    </Box>
  );
};
