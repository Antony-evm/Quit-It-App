import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useFrequency } from '@/features/questionnaire/hooks/useFrequency';

interface FrequencyDataProps {
  style?: any;
}

export const FrequencyData: React.FC<FrequencyDataProps> = ({ style }) => {
  const { frequency, isLoading, error } = useFrequency();

  if (isLoading) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Frequency Data
        </AppText>
        <AppText tone="secondary" style={styles.loadingText}>
          Loading frequency data...
        </AppText>
      </AppSurface>
    );
  }

  if (error) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Frequency Data
        </AppText>
        <AppText
          style={[styles.errorText, { color: COLOR_PALETTE.systemError }]}
        >
          Unable to load frequency data
        </AppText>
      </AppSurface>
    );
  }

  if (!frequency || Object.keys(frequency).length === 0) {
    return (
      <AppSurface style={[styles.card, style]}>
        <AppText variant="heading" style={styles.title}>
          Frequency Data
        </AppText>
        <AppText tone="secondary" style={styles.emptyText}>
          No frequency data available
        </AppText>
      </AppSurface>
    );
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <AppSurface style={[styles.card, style]}>
      <AppText variant="heading" style={styles.title}>
        Frequency Data
      </AppText>
      <View style={styles.dataList}>
        {Object.entries(frequency).map(([key, value]) => (
          <View key={key} style={styles.dataRow}>
            <AppText style={styles.label}>{key}:</AppText>
            <AppText tone="primary" style={styles.value}>
              {formatValue(value)}
            </AppText>
          </View>
        ))}
      </View>
    </AppSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.md,
  },
  title: {
    color: COLOR_PALETTE.textSecondary,
    marginBottom: SPACING.md,
  },
  dataList: {
    gap: SPACING.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  label: {
    fontWeight: '500',
    flex: 1,
    marginRight: SPACING.sm,
  },
  value: {
    flex: 1,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
