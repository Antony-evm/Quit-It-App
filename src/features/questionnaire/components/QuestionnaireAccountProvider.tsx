import React, { useEffect } from 'react';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';
import { QuestionnaireAccountService } from '@/features/questionnaire/services/questionnaireAccountService';

type QuestionnaireAccountProviderProps = {
  children: React.ReactNode;
};

/**
 * Provider component that conditionally prefetches questionnaire account data (question IDs)
 * only when the user should navigate to home based on their status.
 * Similar to TrackingTypesProvider pattern.
 */
export const QuestionnaireAccountProvider: React.FC<
  QuestionnaireAccountProviderProps
> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Only prefetch question IDs if user is authenticated and should navigate to home
    const shouldLoadQuestionIds = async () => {
      if (!isAuthenticated || !user?.userStatusId) {
        return;
      }

      try {
        // Initialize status service if not already done
        if (!UserStatusService.getStatus(user.userStatusId)) {
          await UserStatusService.initialize();
        }

        const action = UserStatusService.getStatusAction(user.userStatusId);

        // Only load question IDs if user should navigate to home
        if (action?.type === 'NAVIGATE_TO_HOME') {
          // Initialize the questionnaire account service to cache question IDs
          await QuestionnaireAccountService.initialize();
        }
      } catch (error) {
        console.warn('Failed to initialize questionnaire account data:', error);
      }
    };

    shouldLoadQuestionIds();
  }, [isAuthenticated, user?.userStatusId]);

  return <>{children}</>;
};
