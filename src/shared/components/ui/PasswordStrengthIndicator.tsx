import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import zxcvbn from 'zxcvbn';
import { SPACING } from '@/shared/theme/spacing';
import { COLOR_PALETTE, BRAND_COLORS } from '@/shared/theme/colors';
import { TYPOGRAPHY } from '@/shared/theme/typography';

interface PasswordStrengthIndicatorProps {
  password: string;
  showDetails?: boolean;
  style?: any;
}

const STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

const STRENGTH_COLORS = [
  '#FF4444', // Very Weak - Red
  '#FF8800', // Weak - Orange
  '#FFBB33', // Fair - Yellow
  '#00AA00', // Good - Light Green
  '#008800', // Strong - Dark Green
];

const STRENGTH_DESCRIPTIONS = [
  'Extremely easy to crack',
  'Easy to crack',
  'Somewhat guessable',
  'Safely unguessable',
  'Very unguessable',
];

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ password, showDetails = true, style }) => {
  const analysis = useMemo(() => {
    if (!password) {
      return null;
    }
    return zxcvbn(password);
  }, [password]);

  const meetsRequirement = useMemo(() => {
    return analysis && analysis.score >= 3;
  }, [analysis]);

  if (!password) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.requirementText}>
          Password Requirements: Create a strong password by making it at least
          8 characters long, avoiding common passwords, and using a mix of
          different characters.
        </Text>
      </View>
    );
  }

  if (!analysis) {
    return null;
  }

  const strengthColor = STRENGTH_COLORS[analysis.score];
  const strengthLabel = STRENGTH_LABELS[analysis.score];
  const strengthDescription = STRENGTH_DESCRIPTIONS[analysis.score];

  return (
    <View style={[styles.container, style]}>
      {/* Strength Bar */}
      <View style={styles.strengthBarContainer}>
        <View style={styles.strengthBarBackground}>
          {[0, 1, 2, 3, 4].map(level => (
            <View
              key={level}
              style={[
                styles.strengthBarSegment,
                {
                  backgroundColor:
                    level <= analysis.score
                      ? strengthColor
                      : COLOR_PALETTE.borderDefault,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Strength Label */}
      <View style={styles.strengthInfo}>
        <Text style={[styles.strengthLabel, { color: strengthColor }]}>
          {strengthLabel}
        </Text>
        <Text
          style={[
            styles.requirementStatus,
            {
              color: meetsRequirement ? '#00AA00' : COLOR_PALETTE.systemError,
            },
          ]}
        >
          {meetsRequirement
            ? '✓ Meets Requirements'
            : '✗ Does Not Meet Requirements'}
        </Text>
      </View>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.descriptionText}>{strengthDescription}</Text>

          {/* Requirement Details */}
          <View style={styles.requirementContainer}>
            <Text style={styles.requirementTitle}>
              To create a strong password:
            </Text>
            <Text style={styles.requirementItem}>
              • Make it at least 8 characters long
            </Text>
            <Text style={styles.requirementItem}>
              • Avoid common passwords and dictionary words
            </Text>
            <Text style={styles.requirementItem}>
              • Use a mix of letters, numbers, and symbols
            </Text>
            <Text style={styles.requirementItem}>
              • Consider using a memorable phrase or sentence
            </Text>
          </View>

          {/* Feedback */}
          {analysis.feedback.warning && (
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackTitle}>⚠️ Warning:</Text>
              <Text style={styles.feedbackText}>
                {analysis.feedback.warning}
              </Text>
            </View>
          )}

          {analysis.feedback.suggestions &&
            analysis.feedback.suggestions.length > 0 && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>💡 Suggestions:</Text>
                {analysis.feedback.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.feedbackText}>
                    • {suggestion}
                  </Text>
                ))}
              </View>
            )}

          {/* Technical Details */}
          <View style={styles.technicalContainer}>
            <Text style={styles.technicalText}>
              Score: {analysis.score}/4 | Estimated crack time:{' '}
              {analysis.crack_times_display.offline_slow_hashing_1e4_per_second}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: 8,
    marginVertical: SPACING.sm,
  },
  strengthBarContainer: {
    marginBottom: SPACING.sm,
  },
  strengthBarBackground: {
    flexDirection: 'row',
    height: 6,
    backgroundColor: COLOR_PALETTE.borderDefault,
    borderRadius: 3,
    gap: 2,
  },
  strengthBarSegment: {
    flex: 1,
    borderRadius: 3,
  },
  strengthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  strengthLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  requirementStatus: {
    ...TYPOGRAPHY.caption,
    fontWeight: '500',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
    paddingTop: SPACING.sm,
  },
  descriptionText: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
    marginBottom: SPACING.sm,
  },
  requirementContainer: {
    marginBottom: SPACING.sm,
  },
  requirementTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.xs,
  },
  requirementText: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
    textAlign: 'center',
  },
  requirementItem: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
    marginBottom: 2,
  },
  feedbackContainer: {
    backgroundColor: COLOR_PALETTE.accentMuted,
    padding: SPACING.sm,
    borderRadius: 6,
    marginBottom: SPACING.sm,
  },
  feedbackTitle: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLOR_PALETTE.textPrimary,
    marginBottom: SPACING.xs,
  },
  feedbackText: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
  },
  technicalContainer: {
    marginTop: SPACING.xs,
  },
  technicalText: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textMuted,
    fontStyle: 'italic',
  },
});
