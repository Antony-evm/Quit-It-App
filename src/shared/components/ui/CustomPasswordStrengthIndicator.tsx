import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { SPACING } from '@/shared/theme/spacing';
import { COLOR_PALETTE } from '@/shared/theme/colors';
import type { CustomPasswordValidation } from '@/shared/hooks/useCustomPasswordValidation';

interface CustomPasswordStrengthIndicatorProps {
  validation: CustomPasswordValidation;
  style?: any;
}

export const CustomPasswordStrengthIndicator: React.FC<
  CustomPasswordStrengthIndicatorProps
> = ({ validation, style }) => {
  if (!validation.password) {
    return (
      <View style={[styles.container, style]}>
        <AppText variant="caption" style={styles.requirementText}>
          Password must contain:
        </AppText>
        <AppText variant="caption" style={styles.requirementItem}>
          ✗ 8-32 characters
        </AppText>
        <AppText variant="caption" style={styles.requirementItem}>
          ✗ At least one uppercase letter
        </AppText>
        <AppText variant="caption" style={styles.requirementItem}>
          ✗ At least one lowercase letter
        </AppText>
        <AppText variant="caption" style={styles.requirementItem}>
          ✗ At least one number
        </AppText>
        <AppText variant="caption" style={styles.requirementItem}>
          ✗ At least one special character
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <AppText variant="caption" style={styles.requirementText}>
        Password Requirements:
      </AppText>

      <AppText
        variant="caption"
        style={[
          styles.requirementItem,
          validation.requirements.hasMinLength &&
          validation.requirements.hasMaxLength
            ? styles.metRequirement
            : styles.unmetRequirement,
        ]}
      >
        {validation.requirements.hasMinLength &&
        validation.requirements.hasMaxLength
          ? '✓'
          : '✗'}{' '}
        8-32 characters
      </AppText>

      <AppText
        variant="caption"
        style={[
          styles.requirementItem,
          validation.requirements.hasUppercase
            ? styles.metRequirement
            : styles.unmetRequirement,
        ]}
      >
        {validation.requirements.hasUppercase ? '✓' : '✗'} At least one
        uppercase letter
      </AppText>

      <AppText
        variant="caption"
        style={[
          styles.requirementItem,
          validation.requirements.hasLowercase
            ? styles.metRequirement
            : styles.unmetRequirement,
        ]}
      >
        {validation.requirements.hasLowercase ? '✓' : '✗'} At least one
        lowercase letter
      </AppText>

      <AppText
        variant="caption"
        style={[
          styles.requirementItem,
          validation.requirements.hasNumber
            ? styles.metRequirement
            : styles.unmetRequirement,
        ]}
      >
        {validation.requirements.hasNumber ? '✓' : '✗'} At least one number
      </AppText>

      <AppText
        variant="caption"
        style={[
          styles.requirementItem,
          validation.requirements.hasSymbol
            ? styles.metRequirement
            : styles.unmetRequirement,
        ]}
      >
        {validation.requirements.hasSymbol ? '✓' : '✗'} At least one special
        character
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
  },
  requirementText: {
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  requirementItem: {
    marginBottom: 2,
    paddingLeft: SPACING.xs,
    color: COLOR_PALETTE.textMuted,
  },
  metRequirement: {
    color: '#10B981', // Green color for met requirements
  },
  unmetRequirement: {
    color: COLOR_PALETTE.textMuted,
  },
});
