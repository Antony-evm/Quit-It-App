import { TouchableOpacity } from 'react-native';
import { AppCard, AppText, Box } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';

type AccountSectionItemProps = {
  title: string;
  onPress: () => void;
};

export const AccountSectionItem = ({
  title,
  onPress,
}: AccountSectionItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <AppCard size="md" style={{ marginBottom: SPACING.md }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <AppText variant="body" tone="primary">
            {title}
          </AppText>
          <AppText tone="secondary">›</AppText>
        </Box>
      </AppCard>
    </TouchableOpacity>
  );
};
