import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AppText, Box, AppIcon } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';
import AimSvg from '@/assets/aim.svg';
import CalendarSvg from '@/assets/calendar.svg';
import StopSvg from '@/assets/stop.svg';
import GoalSvg from '@/assets/goal.svg';

interface QuittingPlanDetailsProps {
  style?: StyleProp<ViewStyle>;
}

export const QuittingPlanDetails: React.FC<QuittingPlanDetailsProps> = ({
  style,
}) => {
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return (
      <Box gap="md">
        <AppText tone="secondary" style={styles.loadingText}>
          Loading plan details...
        </AppText>
      </Box>
    );
  }

  if (error) {
    return (
      <Box gap="md">
        <AppText
          style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}
        >
          Unable to load plan details
        </AppText>
      </Box>
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
    <Box gap="md" style={style}>
      <Box bg="backgroundPrimary" borderRadius="small" p="lg">
        <Box flexDirection="row" alignItems="center" gap="sm">
          <AppIcon icon={AimSvg} />
          <AppText tone="primary" variant="body">
            {plan.status}
          </AppText>
        </Box>
      </Box>

      <Box bg="backgroundPrimary" borderRadius="small" p="lg">
        <Box flexDirection="row" alignItems="center" gap="sm">
          <AppIcon icon={CalendarSvg} />
          <AppText tone="primary" variant="body">
            {formatDate(plan.date)}
          </AppText>
        </Box>
      </Box>

      <Box bg="backgroundPrimary" borderRadius="small" p="lg">
        <Box flexDirection="row" alignItems="center" gap="sm">
          <AppIcon icon={StopSvg} />
          <AppText tone="primary" variant="body">
            {plan.current} cigarettes per day
          </AppText>
        </Box>
      </Box>

      <Box bg="backgroundPrimary" borderRadius="small" p="lg">
        <Box flexDirection="row" alignItems="center" gap="sm">
          <AppIcon icon={GoalSvg} />
          <AppText tone="primary" variant="body">
            {plan.target} cigarettes per day
          </AppText>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
