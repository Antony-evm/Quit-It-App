import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { AppSurface, AppText, Box } from '@/shared/components/ui';
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
      <AppSurface style={styles.container}>
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
      </AppSurface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
});
