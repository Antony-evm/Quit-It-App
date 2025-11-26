import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import { useQuittingPlan } from '@/features/questionnaire/hooks/useQuittingPlan';

interface QuittingPlanCardProps {
  style?: any;
}

export const QuittingPlanCard: React.FC<QuittingPlanCardProps> = ({
  style,
}) => {
  const { plan, isLoading, error } = useQuittingPlan();

  if (isLoading) {
    return (
      <AppText tone="primary" variant="body" style={styles.planText}>
        Loading your plan...
      </AppText>
    );
  }

  if (error) {
    return (
      <AppText tone="primary" variant="body" style={styles.planText}>
        Unable to load your plan
      </AppText>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <AppText tone="primary" variant="body" style={styles.planText}>
      {plan.text}
    </AppText>
  );
};

const styles = StyleSheet.create({
  planText: {
    marginBottom: SPACING.md,
  },
});
