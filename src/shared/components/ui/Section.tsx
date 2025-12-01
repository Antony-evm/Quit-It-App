import { memo, PropsWithChildren } from 'react';

import { AppCard, AppCardProps } from './AppCard';
import { AppText } from './AppText';
import { Box } from './Box';

export type SectionProps = PropsWithChildren<{
  title: string;
  cardVariant?: AppCardProps['variant'];
  cardSize?: AppCardProps['size'];
  showCard?: boolean;
}>;

export const Section = memo(
  ({
    title,
    children,
    cardVariant = 'elevated',
    cardSize = 'lg',
    showCard = true,
  }: SectionProps) => {
    const content = showCard ? (
      <AppCard variant={cardVariant} size={cardSize}>
        {children}
      </AppCard>
    ) : (
      children
    );

    return (
      <Box mb="xl" accessibilityRole="none">
        <Box mb="sm">
          <AppText variant="heading">{title}</AppText>
        </Box>
        {content}
      </Box>
    );
  },
);

Section.displayName = 'Section';
