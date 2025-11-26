import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useTriggers } from '@/features/questionnaire/hooks/useTriggers';

interface TriggersListProps {
  style?: any;
}

export const TriggersList: React.FC<TriggersListProps> = ({ style }) => {
  const { triggers, isLoading, error } = useTriggers();

  if (isLoading) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Triggers
        </AppText>
        <AppText tone="secondary" style={styles.loadingText}>
          Loading triggers...
        </AppText>
      </AppSurface>
    );
  }

  if (error) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Triggers
        </AppText>
        <AppText
          style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}
        >
          Unable to load triggers
        </AppText>
      </AppSurface>
    );
  }

  if (!triggers || triggers.length === 0) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Triggers
        </AppText>
        <AppText tone="secondary" style={styles.emptyText}>
          No triggers available
        </AppText>
      </AppSurface>
    );
  }

  return (
    <AppSurface style={[styles.card, style]}>
      <AppText variant="heading" style={styles.title}>
        Triggers
      </AppText>
      <View style={styles.triggersList}>
        {triggers.map((trigger, index) => (
          <View key={index} style={styles.triggerItem}>
            <View style={styles.bullet} />
            <AppText style={styles.triggerText}>{trigger}</AppText>
          </View>
        ))}
      </View>
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundCream,
  },
  title: {
    color: COLOR_PALETTE.textSecondary,
    marginBottom: SPACING.md,
  },
  triggersList: {
    gap: SPACING.xs,
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLOR_PALETTE.accentPrimary,
    marginTop: 8,
    marginRight: SPACING.sm,
    flexShrink: 0,
  },
  triggerText: {
    color: COLOR_PALETTE.textSecondary,
    flex: 1,
    lineHeight: 22,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
