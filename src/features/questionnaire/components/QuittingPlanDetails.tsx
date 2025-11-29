import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
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
      <View style={styles.wrapper}>
        <AppText tone="secondary" style={styles.loadingText}>
          Loading plan details...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.wrapper}>
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
    <View style={[styles.wrapper, style]}>
      <View style={styles.box}>
        <View style={styles.row}>
          <AimSvg width={24} height={24} color={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body">
            {plan.status}
          </AppText>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.row}>
          <CalendarSvg
            width={24}
            height={24}
            color={COLOR_PALETTE.textPrimary}
          />
          <AppText tone="primary" variant="body">
            {formatDate(plan.date)}
          </AppText>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.row}>
          <StopSvg width={24} height={24} color={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body">
            {plan.current} cigarettes per day
          </AppText>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.row}>
          <GoalSvg width={24} height={24} color={COLOR_PALETTE.textPrimary} />
          <AppText tone="primary" variant="body">
            {plan.target} cigarettes per day
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: SPACING.md,
  },
  box: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 8,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
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
