import { useTranslation } from 'react-i18next';

import { useAuth } from '@/shared/auth/AuthContext';
import { useQuittingPlan } from '@/features/questionnaire';
import { useSmokingAnalytics } from '@/features/tracking';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

export const useWelcomeData = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { plan } = useQuittingPlan();
  const { data: smokingAnalytics } = useSmokingAnalytics();

  const rawName = user?.firstName || user?.lastName || 'Friend';
  const formattedName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  const today = new Date();

  let message = '';
  let timeDifference = '';

  if (plan) {
    const status = plan.status;

    if (status === 'Cut Down' || status === 'Cut down first') {
      message = t('home.nextMilestoneIn');
      timeDifference = getFormattedTimeDifference(today, plan.date);
    } else if (status === 'Quit It' || status === 'Quit it') {
      if (today.getTime() < plan.date.getTime()) {
        message = t('home.goingSmokeFreeIn');
        timeDifference = getFormattedTimeDifference(today, plan.date);
      } else if (today.getTime() > plan.date.getTime()) {
        if (smokingAnalytics?.last_smoking_day) {
          message = t('home.smokeFreeFor');
          const lastSmokingDate = new Date(smokingAnalytics.last_smoking_day);
          timeDifference = getFormattedTimeDifference(lastSmokingDate, today);
        }
      }
    }
  }

  const title = t('home.keepStreakGoing', { name: formattedName });

  return {
    title,
    message,
    timeDifference,
  };
};
