import React, { useEffect } from 'react';
import { useAuth } from '@/shared/auth';
import { UserStatusService } from '@/shared/services/userStatusService';
import { QuestionnaireAccountService } from '@/features/questionnaire/services/questionnaireAccountService';

type QuestionnaireAccountProviderProps = {
  children: React.ReactNode;
};

export const QuestionnaireAccountProvider: React.FC<
  QuestionnaireAccountProviderProps
> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const shouldLoadQuestionIds = async () => {
      if (!isAuthenticated || !user?.userStatusId) {
        return;
      }

      try {
        if (!UserStatusService.getStatus(user.userStatusId)) {
          await UserStatusService.initialize();
        }

        const action = UserStatusService.getStatusAction(user.userStatusId);

        if (action?.type === 'NAVIGATE_TO_HOME') {
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
