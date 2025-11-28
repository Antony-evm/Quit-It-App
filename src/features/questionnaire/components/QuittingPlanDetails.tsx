import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';
import AimSvg from '@/assets/aim.svg';
import CalendarSvg from '@/assets/calendar.svg';
import StopSvg from '@/assets/stop.svg';
import GoalSvg from '@/assets/goal.svg';

interface QuittingPlanDetailsProps {
  style?: any;
}

export const QuittingPlanDetails: React.FC<QuittingPlanDetailsProps> = ({
  style,
}) => {
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <AppText tone="secondary" style={styles.loadingText}>
          Loading plan details...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <AppText
          style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}
        >
          Unable to load plan details
        </AppText>
      </View>
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
    <View style={[styles.container, style]}>
      <View style={styles.section}>
        <View style={styles.row}>
          <AimSvg width={24} height={24} fill={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body" style={styles.detailsText}>
            {plan.status}
          </AppText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <CalendarSvg
            width={24}
            height={24}
            stroke={COLOR_PALETTE.textPrimary}
          />
          <AppText tone="primary" variant="body" style={styles.detailsText}>
            {formatDate(plan.date)}
          </AppText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <StopSvg width={24} height={24} fill={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body" style={styles.detailsText}>
            {plan.current} cigarettes/day
          </AppText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <GoalSvg width={24} height={24} stroke={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body" style={styles.detailsText}>
            {plan.target} cigarettes/day!
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BRAND_COLORS.ink,
    borderRadius: 8,
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailsText: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
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
