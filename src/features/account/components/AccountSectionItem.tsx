import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppSurface, AppText } from '@/shared/components/ui';
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
        <View style={styles.content}>
          <AppText variant="body" tone="primary">
            {title}
          </AppText>
          <AppText tone="secondary">›</AppText>
        </View>
      </AppSurface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
