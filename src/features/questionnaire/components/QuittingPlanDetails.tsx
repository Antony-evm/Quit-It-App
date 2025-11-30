import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { AppText, Box, AppIcon, StatusMessage } from '@/shared/components/ui';
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
    return <StatusMessage type="loading" message="Loading plan details..." />;
  }

  if (error) {
    return <StatusMessage type="error" message="Unable to load plan details" />;
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
