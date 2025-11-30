import React, { memo } from 'react';
import { AppText, StatusMessage } from '@/shared/components/ui';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';

export const QuittingPlanCard = memo(() => {
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return (
      <StatusMessage
        type="loading"
        message="Loading your plan..."
        showSpinner
      />
    );
  }

  if (error) {
    return <StatusMessage type="error" message="Unable to load your plan" />;
  }

  if (!plan) {
    return null;
  }

  return (
    <AppText
      accessibilityRole="text"
      accessibilityLabel={`Your quitting plan: ${plan.text}`}
    >
      {plan.text}
    </AppText>
  );
});

QuittingPlanCard.displayName = 'QuittingPlanCard';
