import { AppText, Box } from '@/shared/components/ui';
import { SYSTEM } from '@/shared/theme';

type QuestionnaireReviewProps = {
  reviewData: [string, string][];
};

export const QuestionnaireReview = ({
  reviewData,
}: QuestionnaireReviewProps) => (
  <Box gap="lg">
    {reviewData.map(([title, text], index) => (
      <Box
        key={index}
        gap="md"
        variant={index > 0 ? 'buttonSeparator' : undefined}
        px="sm"
        alignItems="stretch"
      >
        <AppText variant="heading">{title}</AppText>
        <Box style={{ height: 1, backgroundColor: SYSTEM.border }} />
        <Box gap="sm">
          {text.split('\n').map((line, lineIndex) => (
            <AppText key={lineIndex} variant="body">
              {line.trim()}
            </AppText>
          ))}
        </Box>
      </Box>
    ))}
  </Box>
);
