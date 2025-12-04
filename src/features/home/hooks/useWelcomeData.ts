import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/auth/AuthContext';
import { useQuittingPlan } from '@/features/questionnaire';
import { useSmokingAnalytics } from '@/features/tracking';
import { capitalizeFirst } from '@/utils/stringUtils';

type WelcomeData = {
  title: string;
  message: string;
  targetDate?: Date;
};

export const useWelcomeData = (): WelcomeData => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { plan } = useQuittingPlan();
  const { data: smokingAnalytics } = useSmokingAnalytics();

  const formattedName = useMemo(() => {
    const rawName = user?.firstName || user?.lastName || 'Friend';
    return capitalizeFirst(rawName);
  }, [user?.firstName, user?.lastName]);

  const title = useMemo(
    () => t('home.keepStreakGoing', { name: formattedName }),
    [t, formattedName],
  );

  const { message, targetDate } = useMemo(() => {
    if (!plan) {
      return { message: '', targetDate: undefined };
    }

    const now = new Date();
    const { status } = plan;

    if (status === 'Cut Down') {
      return {
        message: t('home.nextMilestoneIn'),
        targetDate: plan.datetime,
      };
    }

    if (status === 'Quit It') {
      const isPlanDateInFuture = now.getTime() < plan.datetime.getTime();

      if (isPlanDateInFuture) {
        return {
          message: t('home.goingSmokeFreeIn'),
          targetDate: plan.datetime,
        };
      }

      return {
        message: t('home.smokeFreeFor'),
        targetDate: smokingAnalytics!.last_smoking_day,
      };
    }

    return { message: '', targetDate: undefined };
  }, [plan, smokingAnalytics?.last_smoking_day, t]);

  return {
    title,
    message,
    targetDate,
  };
};
