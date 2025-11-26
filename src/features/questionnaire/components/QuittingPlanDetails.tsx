import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';

interface QuittingPlanDetailsProps {
  style?: any;
}

export const QuittingPlanDetails: React.FC<QuittingPlanDetailsProps> = ({
  style,
}) => {
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return (
      <AppText tone="secondary" style={styles.loadingText}>
        Loading plan details...
      </AppText>
    );
  }

  if (error) {
    return (
      <AppText style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}>
        Unable to load plan details
      </AppText>
    );
  }

  if (!plan) {
    return null;
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <AppSurface style={[styles.card, style]}>
      <View style={styles.detailRow}>
        <AppText style={styles.label}>Aim: </AppText>
        <AppText tone="primary" variant="body" style={styles.detailsText}>
          {plan.status}
        </AppText>
      </View>

      <View style={styles.detailRow}>
        <AppText style={styles.label}>When: </AppText>
        <AppText tone="primary" variant="body" style={styles.detailsText}>
          {formatDate(plan.date)}
        </AppText>
      </View>

      <View style={styles.detailRow}>
        <AppText style={styles.label}>Starting: </AppText>
        <AppText tone="primary" variant="body" style={styles.detailsText}>
          {plan.current} cigarettes/day
        </AppText>
      </View>

      <View style={styles.detailRow}>
        <AppText style={styles.label}>Goal: </AppText>
        <AppText tone="primary" variant="body" style={styles.detailsText}>
          {plan.target} cigarettes/day!
        </AppText>
      </View>
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 0,
    margin: 0,
  },
  detailsText: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  label: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '500',
  },
  value: {
    color: COLOR_PALETTE.textSecondary,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
