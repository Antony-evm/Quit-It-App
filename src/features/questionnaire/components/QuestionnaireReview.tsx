import { AppText, Box } from '@/shared/components/ui';

type QuestionnaireReviewProps = {
  reviewData: string[];
};

export const QuestionnaireReview = ({
  reviewData,
}: QuestionnaireReviewProps) => (
  <Box gap="lg">
    {reviewData.map((text, index) => (
      <Box
        key={index}
        gap="sm"
        variant={index > 0 ? 'buttonSeparator' : undefined}
        px="zero"
        alignItems="stretch"
      >
        {text.split('\n').map((line, lineIndex) => (
          <AppText key={lineIndex} variant="body">
            {line.trim()}
          </AppText>
        ))}
      </Box>
    ))}
  </Box>
);
