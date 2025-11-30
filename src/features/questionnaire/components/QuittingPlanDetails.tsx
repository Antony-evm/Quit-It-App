import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Box, StatusMessage, IconTextCard } from '@/shared/components/ui';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';
import { formatPlanDate } from '@/features/questionnaire/utils/dateFormatting';
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
  const { t } = useTranslation();
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return <StatusMessage type="loading" message={t('plan.loading')} />;
  }

  if (error) {
    return <StatusMessage type="error" message={t('plan.error')} />;
  }

  if (!plan) {
    return null;
  }

  return (
    <Box gap="md" style={style}>
      <IconTextCard icon={AimSvg} text={plan.status} />
      <IconTextCard icon={CalendarSvg} text={formatPlanDate(plan.date)} />
      <IconTextCard
        icon={StopSvg}
        text={t('plan.cigarettesPerDay', { count: plan.current })}
      />
      <IconTextCard
        icon={GoalSvg}
        text={t('plan.cigarettesPerDay', { count: plan.target })}
      />
    </Box>
  );
};
