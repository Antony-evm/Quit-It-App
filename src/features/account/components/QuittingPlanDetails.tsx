import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, StatusMessage, IconTextCard } from '@/shared/components/ui';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';
import { formatPlanDate } from '@/utils/dateUtils';
import AimSvg from '@/assets/aim.svg';
import CalendarSvg from '@/assets/calendar.svg';
import StopSvg from '@/assets/stop.svg';
import GoalSvg from '@/assets/goal.svg';

export const QuittingPlanDetails: React.FC = () => {
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
    <Box gap="md">
      <IconTextCard icon={AimSvg} text={plan.status} />
      <IconTextCard icon={CalendarSvg} text={formatPlanDate(plan.datetime)} />
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
