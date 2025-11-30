import React, { PropsWithChildren } from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';

import {
  SPACING,
  SpacingToken,
  COLOR_PALETTE,
  ColorToken,
  BORDER_RADIUS,
  BORDER_WIDTH,
  BorderRadiusToken,
  SHADOWS,
  FOOTER_LAYOUT,
} from '../../theme';

const BOX_VARIANTS = {
  default: {
    gap: SPACING.xl,
    width: '100%',
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2,
  },
  chartContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  chip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.xs,
  },
  note: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: BORDER_WIDTH.sm,
    borderTopWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  separator: {
    height: SPACING.md,
  },
  buttonSeparator: {
    borderTopWidth: BORDER_WIDTH.sm,
    padding: SPACING.sm,
    paddingBottom: SPACING.xs,
    alignItems: 'center',
    borderTopColor: COLOR_PALETTE.borderDefault,
  },
  statCard: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: BORDER_WIDTH.md,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  authHeader: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    height: '15%',
  },
  welcomeHeader: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: BORDER_WIDTH.lg,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    ...SHADOWS.lg,
  },
  highlightCard: {
    marginTop: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: BORDER_WIDTH.md,
    borderColor: COLOR_PALETTE.borderDefault,
    ...SHADOWS.xl,
  },
  valuePill: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    alignItems: 'center',
    gap: SPACING.xs,
    borderRadius: BORDER_RADIUS.none,
    borderWidth: BORDER_WIDTH.none,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.md,
    borderBottomWidth: BORDER_WIDTH.sm,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  gridContainer: {
    borderRadius: BORDER_RADIUS.small,
    overflow: 'hidden',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  sliderOverlay: {
    position: 'absolute',
    top: '35%',
    width: '90%',
    alignItems: 'flex-end',
  },
  progressTrack: {
    height: 6,
    backgroundColor: COLOR_PALETTE.borderDefault,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLOR_PALETTE.textPrimary,
    borderRadius: 3,
  },
  drawerTitle: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: BORDER_WIDTH.sm,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    ...SHADOWS.md,
    zIndex: 5,
  },
} satisfies Record<string, ViewStyle>;

export type BoxVariant = keyof typeof BOX_VARIANTS;

export type BoxProps = PropsWithChildren<
  ViewProps & {
    /** Predefined Box style variants */
    variant?: BoxVariant;
    /** Padding on all sides */
    p?: SpacingToken;
    /** Horizontal padding (left and right) */
    px?: SpacingToken;
    /** Vertical padding (top and bottom) */
    py?: SpacingToken;
    /** Padding top */
    pt?: SpacingToken;
    /** Padding bottom */
    pb?: SpacingToken;
    /** Padding left */
    pl?: SpacingToken;
    /** Padding right */
    pr?: SpacingToken;
    /** Margin on all sides */
    m?: SpacingToken;
    /** Horizontal margin (left and right) */
    mx?: SpacingToken;
    /** Vertical margin (top and bottom) */
    my?: SpacingToken;
    /** Margin top */
    mt?: SpacingToken;
    /** Margin bottom */
    mb?: SpacingToken;
    /** Margin left */
    ml?: SpacingToken;
    /** Margin right */
    mr?: SpacingToken;
    /** Gap between children (requires flex layout) */
    gap?: SpacingToken;
    /** Row gap between children */
    rowGap?: SpacingToken;
    /** Column gap between children */
    columnGap?: SpacingToken;
    /** Background color from theme palette */
    bg?: ColorToken;
    /** Border radius from theme tokens */
    borderRadius?: BorderRadiusToken;
    /** Flex value */
    flex?: number;
    /** Flex direction */
    flexDirection?: ViewStyle['flexDirection'];
    /** Align items */
    alignItems?: ViewStyle['alignItems'];
    /** Justify content */
    justifyContent?: ViewStyle['justifyContent'];
    /** Flex wrap */
    flexWrap?: ViewStyle['flexWrap'];
    /** Additional styles */
    style?: StyleProp<ViewStyle>;
  }
>;

export const Box = ({
  children,
  p,
  px,
  py,
  pt,
  pb,
  pl,
  pr,
  m,
  mx,
  my,
  mt,
  mb,
  ml,
  mr,
  gap,
  rowGap,
  columnGap,
  bg,
  borderRadius,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  flexWrap,
  style,
  variant,
  ...viewProps
}: BoxProps) => {
  const boxStyle: ViewStyle = {
    // Padding
    ...(p !== undefined && { padding: SPACING[p] }),
    ...(px !== undefined && {
      paddingHorizontal: SPACING[px],
    }),
    ...(py !== undefined && {
      paddingVertical: SPACING[py],
    }),
    ...(pt !== undefined && { paddingTop: SPACING[pt] }),
    ...(pb !== undefined && { paddingBottom: SPACING[pb] }),
    ...(pl !== undefined && { paddingLeft: SPACING[pl] }),
    ...(pr !== undefined && { paddingRight: SPACING[pr] }),
    // Margin
    ...(m !== undefined && { margin: SPACING[m] }),
    ...(mx !== undefined && {
      marginHorizontal: SPACING[mx],
    }),
    ...(my !== undefined && {
      marginVertical: SPACING[my],
    }),
    ...(mt !== undefined && { marginTop: SPACING[mt] }),
    ...(mb !== undefined && { marginBottom: SPACING[mb] }),
    ...(ml !== undefined && { marginLeft: SPACING[ml] }),
    ...(mr !== undefined && { marginRight: SPACING[mr] }),
    // Gap
    ...(gap !== undefined && { gap: SPACING[gap] }),
    ...(rowGap !== undefined && { rowGap: SPACING[rowGap] }),
    ...(columnGap !== undefined && { columnGap: SPACING[columnGap] }),
    // Background
    ...(bg !== undefined && { backgroundColor: COLOR_PALETTE[bg] }),
    // Border radius
    ...(borderRadius !== undefined && {
      borderRadius: BORDER_RADIUS[borderRadius],
    }),
    // Flex properties
    ...(flex !== undefined && { flex }),
    ...(flexDirection !== undefined && { flexDirection }),
    ...(alignItems !== undefined && { alignItems }),
    ...(justifyContent !== undefined && { justifyContent }),
    ...(flexWrap !== undefined && { flexWrap }),
  };

  return (
    <View
      style={[styles.base, variant && BOX_VARIANTS[variant], boxStyle, style]}
      {...viewProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base styles can be added here if needed
  },
});
