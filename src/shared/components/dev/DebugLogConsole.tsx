import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { debugLogger } from '../../logging/debugLogger';
import { useDebugLogs } from '../../hooks/useDebugLogs';
import { COLOR_PALETTE, SPACING, TYPOGRAPHY } from '../../theme';

const formatPayload = (payload: unknown): string => {
  if (payload === undefined || payload === null) {
    return '';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
};

export const DebugLogConsole = () => {
  const logs = useDebugLogs();
  const [isOpen, setIsOpen] = useState(false);

  const orderedLogs = useMemo(() => [...logs].reverse(), [logs]);

  if (!__DEV__) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View pointerEvents="box-none" style={styles.floatingContainer}>
        <Pressable
          accessibilityRole="button"
          style={[styles.toggleButton, isOpen && styles.toggleButtonActive]}
          onPress={() => setIsOpen((prev) => !prev)}
        >
          <Text style={styles.toggleLabel}>
            {isOpen ? 'Hide logs' : 'Show logs'}
          </Text>
        </Pressable>
      </View>

      {isOpen ? (
        <View style={styles.console} pointerEvents="auto">
          <View style={styles.header}>
            <Text style={styles.title}>Debug logs</Text>
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => debugLogger.clear()}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonLabel}>Clear</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsOpen(false)}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonLabel}>Close</Text>
              </Pressable>
            </View>
          </View>
          <ScrollView
            style={styles.logScroll}
            contentContainerStyle={styles.logScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {orderedLogs.length === 0 ? (
              <Text style={styles.emptyState}>
                No logs captured yet. Interact with the app to start collecting
                events.
              </Text>
            ) : (
              orderedLogs.map((entry) => {
                const payload = formatPayload(entry.payload);
                return (
                  <View key={entry.id} style={styles.logEntry}>
                    <Text style={styles.logMeta}>
                      {`${new Date(entry.timestamp).toLocaleTimeString()} · ${
                        entry.scope
                      } · ${entry.level.toUpperCase()}`}
                    </Text>
                    <Text style={styles.logMessage}>{entry.message}</Text>
                    {payload ? (
                      <Text style={styles.logPayload}>{payload}</Text>
                    ) : null}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  toggleButton: {
    backgroundColor: COLOR_PALETTE.accentPrimary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  toggleButtonActive: {
    backgroundColor: COLOR_PALETTE.textPrimary,
  },
  toggleLabel: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.backgroundPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  console: {
    position: 'absolute',
    bottom: SPACING.xxl * 2,
    left: SPACING.lg,
    right: SPACING.lg,
    maxHeight: 360,
    borderRadius: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.heading,
    color: COLOR_PALETTE.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.xs,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  headerButtonLabel: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
  },
  logScroll: {
    flex: 1,
  },
  logScrollContent: {
    paddingBottom: SPACING.sm,
  },
  logEntry: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  logMeta: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
    marginBottom: SPACING.xs,
  },
  logMessage: {
    ...TYPOGRAPHY.body,
    color: COLOR_PALETTE.textPrimary,
  },
  logPayload: {
    ...TYPOGRAPHY.caption,
    color: COLOR_PALETTE.textSecondary,
    marginTop: SPACING.xs,
  },
  emptyState: {
    ...TYPOGRAPHY.body,
    color: COLOR_PALETTE.textSecondary,
  },
});
