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
