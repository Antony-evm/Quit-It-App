import React from 'react';
import {
  ImageBackground,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppText } from '../../../shared/components/ui';
import { SPACING } from '../../../shared/theme';

const BACKGROUND_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
};

export type HomeEntry = {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  type: 'craving' | 'cigarette';
};

type HomeEntriesPlaceholderProps = {
  entries: HomeEntry[];
  style?: StyleProp<ViewStyle>;
};

export const HomeEntriesPlaceholder = ({ entries, style }: HomeEntriesPlaceholderProps) => (
  <View style={[styles.container, style]}>
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.background}
      imageStyle={styles.image}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        <AppText variant='heading' tone='inverse' style={styles.header}>
          Recent activity
        </AppText>
        <View style={styles.entries}>
          {entries.map((entry, index) => (
            <View
              key={entry.id}
              style={[
                styles.entry,
                index > 0 && styles.entrySpacing,
                entry.type === 'craving' ? styles.entryCraving : styles.entryCigarette,
              ]}
            >
              <View style={styles.entryHeader}>
                <AppText variant='body' tone='inverse' style={styles.entryTitle}>
                  {entry.title}
                </AppText>
                <AppText variant='caption' tone='inverse'>
                  {entry.timestamp}
                </AppText>
              </View>
              <AppText variant='caption' tone='inverse'>
                {entry.description}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 5,
  },
  background: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  content: {
    flex: 1,
    padding: SPACING.xxl,
    justifyContent: 'flex-end',
  },
  header: {
    marginBottom: SPACING.lg,
  },
  entries: {},
  entry: {
    padding: SPACING.md,
    borderRadius: 14,
  },
  entrySpacing: {
    marginTop: SPACING.md,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  entryTitle: {
    fontWeight: '600',
  },
  entryCraving: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
  },
  entryCigarette: {
    backgroundColor: 'rgba(248, 113, 113, 0.3)',
  },
});
