import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppButton, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useTrackingLogs } from '../hooks/useTrackingLogs';
import type { TrackingRecord } from '../types';
import { TrackingLogCard } from './TrackingLogCard';

type TrackingLogListProps = {
  userId?: number;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export const TrackingLogList = ({
  userId,
  contentContainerStyle,
}: TrackingLogListProps) => {
  const {
    records,
    isLoading,
    error,
    isRefetching,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    refresh,
  } = useTrackingLogs({ userId });

  const renderItem = useCallback<ListRenderItem<TrackingRecord>>(
    ({ item }) => <TrackingLogCard record={item} />,
    [],
  );

  const keyExtractor = useCallback((item: TrackingRecord) => `${item.id}`, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  const renderFooter = () => {
    if (!isFetchingNextPage) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />
      </View>
    );
  };

  const renderEmptyState = () => {
    if (isLoading || isRefetching) {
      return null;
    }

    return (
      <View style={styles.stateContainer}>
        <AppText variant="heading" style={styles.stateTitle}>
          No logs yet
        </AppText>
        <AppText tone="secondary" style={styles.stateSubtitle}>
          Your previous entries will show up here.
        </AppText>
      </View>
    );
  };

  const renderErrorState = () => (
    <View style={styles.stateContainer}>
      <AppText variant="heading" style={styles.stateTitle}>
        We couldn&apos;t load your logs.
      </AppText>
      <AppText tone="secondary" style={styles.stateSubtitle}>
        Please check your connection and try again.
      </AppText>
      <AppButton label="Retry" onPress={refresh} containerStyle={styles.retryButton} />
    </View>
  );

  if (error && !records.length) {
    return renderErrorState();
  }

  if (isLoading && !records.length) {
    return (
      <View style={styles.stateContainer}>
        <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />
        <AppText tone="secondary" style={styles.loadingLabel}>
          Loading your activity log...
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={records}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      refreshing={isRefetching && !isLoading}
      onRefresh={refresh}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={[
        styles.listContent,
        records.length === 0 && styles.listContentEmpty,
        contentContainerStyle,
      ]}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: SPACING.lg,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingVertical: SPACING.md,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  stateTitle: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  stateSubtitle: {
    textAlign: 'center',
  },
  retryButton: {
    marginTop: SPACING.lg,
    width: '60%',
  },
  loadingLabel: {
    marginTop: SPACING.md,
  },
});
