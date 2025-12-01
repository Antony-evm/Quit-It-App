import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/auth/AuthContext';
import { useQuittingPlan } from '@/features/questionnaire';
import { useSmokingAnalytics } from '@/features/tracking';
import { getFormattedTimeDifference } from '@/utils/dateUtils';
import { capitalizeFirst } from '@/utils/stringUtils';

type WelcomeData = {
  title: string;
  message: string;
  timeDifference: string;
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

  const { message, timeDifference } = useMemo(() => {
    if (!plan) {
      return { message: '', timeDifference: '' };
    }

    const now = new Date();
    const { status } = plan;

    if (status === 'Cut Down') {
      return {
        message: t('home.nextMilestoneIn'),
        timeDifference: getFormattedTimeDifference(now, plan.date),
      };
    }

    if (status === 'Quit It') {
      const isPlanDateInFuture = now.getTime() < plan.date.getTime();

      if (isPlanDateInFuture) {
        return {
          message: t('home.goingSmokeFreeIn'),
          timeDifference: getFormattedTimeDifference(now, plan.date),
        };
      }

      return {
        message: t('home.smokeFreeFor'),
        timeDifference: getFormattedTimeDifference(
          smokingAnalytics!.last_smoking_day,
          now,
        ),
      };
    }

    return { message: '', timeDifference: '' };
  }, [plan, smokingAnalytics?.last_smoking_day, t]);

  return {
    title,
    message,
    timeDifference,
  };
};
