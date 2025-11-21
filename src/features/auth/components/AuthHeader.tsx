import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Logo } from '@/shared/components/ui';

export const AuthHeader = () => {
  return (
    <View style={styles.logoSection}>
      <Logo size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  logoSection: {
    height: '15%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
