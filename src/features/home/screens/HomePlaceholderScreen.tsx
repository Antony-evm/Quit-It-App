import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppText } from '../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';

type HomePlaceholderScreenProps = {
  onStartOver?: () => void;
};

export const HomePlaceholderScreen = ({
  onStartOver,
}: HomePlaceholderScreenProps) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.content}>
      <AppText variant="heading">Welcome home</AppText>
      <AppText tone="secondary">
        This is a placeholder home screen. We&apos;ll flesh out the design
        details later, but you&apos;ve successfully finished the questionnaire.
      </AppText>
      {onStartOver ? (
        <AppButton label="Restart questionnaire" onPress={onStartOver} />
      ) : null}
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
});

