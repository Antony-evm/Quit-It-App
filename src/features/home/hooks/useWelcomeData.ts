import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/auth/AuthContext';
import { useQuittingPlan } from '@/features/questionnaire';
import { useSmokingAnalytics } from '@/features/tracking';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CUT_DOWN_STATUSES = ['Cut Down', 'Cut down first'] as const;
const QUIT_STATUSES = ['Quit It', 'Quit it'] as const;

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

    const today = new Date();
    const status = plan.status;
    const isCutDown = CUT_DOWN_STATUSES.includes(
      status as (typeof CUT_DOWN_STATUSES)[number],
    );
    const isQuit = QUIT_STATUSES.includes(
      status as (typeof QUIT_STATUSES)[number],
    );

    if (isCutDown) {
      return {
        message: t('home.nextMilestoneIn'),
        timeDifference: getFormattedTimeDifference(today, plan.date),
      };
    }

    if (isQuit) {
      const isPlanDateInFuture = today.getTime() < plan.date.getTime();
      const isPlanDateInPast = today.getTime() > plan.date.getTime();

      if (isPlanDateInFuture) {
        return {
          message: t('home.goingSmokeFreeIn'),
          timeDifference: getFormattedTimeDifference(today, plan.date),
        };
      }

      if (isPlanDateInPast && smokingAnalytics?.last_smoking_day) {
        const lastSmokingDate = new Date(smokingAnalytics.last_smoking_day);
        return {
          message: t('home.smokeFreeFor'),
          timeDifference: getFormattedTimeDifference(lastSmokingDate, today),
        };
      }
    }

    return { message: '', timeDifference: '' };
  }, [plan, smokingAnalytics?.last_smoking_day, t]);

  return {
    title,
    message,
    timeDifference,
  };
};
