import type { QuestionnaireResponseRecord } from '../types';
import { AppCard, AppText, Box } from '@/shared/components/ui';
import { resolveAnswerDisplay } from '../utils/answerFormatting';

type QuestionnaireReviewProps = {
  responses: QuestionnaireResponseRecord[];
};

export const QuestionnaireReview = ({
  responses,
}: QuestionnaireReviewProps) => (
  <Box gap="lg">
    <Box gap="lg">
      {responses.map(response => {
        const answer = resolveAnswerDisplay(response);
        return (
          <AppCard key={response.questionId} gap="md">
            <AppText variant="body">{response.question}</AppText>
            <AppText variant="caption">{answer.primary}</AppText>
          </AppCard>
        );
      })}
    </Box>
  </Box>
);
