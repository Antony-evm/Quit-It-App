import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import {
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS as THEME_SHADOWS,
  BORDER_WIDTH,
} from '../theme';

/**
 * Common shadow/elevation styles to reduce repetition
 */
export const SHADOWS = {
  small: THEME_SHADOWS.sm,
  medium: THEME_SHADOWS.md,
  large: THEME_SHADOWS.softLg,
} as const;

/**
 * Variant-based surface styles for flexible theming
 */
export const SURFACE_VARIANTS = {
  // Interactive surfaces
  interactive: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: BORDER_RADIUS.xlarge,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
  },

  // Card surfaces
  card: {
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
  },

  // Elevated surfaces (dropdowns, modals)
  elevated: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderRadius: BORDER_RADIUS.large,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
    ...SHADOWS.medium,
  },

  // Input surfaces
  input: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
} as const;

/**
 * Utility function to get surface variant styles
 */
export const getSurfaceVariant = (variant: keyof typeof SURFACE_VARIANTS) =>
  SURFACE_VARIANTS[variant];

/**
 * Common layout styles that can be composed with variants
 */
export const LAYOUT_STYLES = StyleSheet.create({
  // Dropdown layouts
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  } as ViewStyle,

  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: SPACING.xs,
    maxHeight: 150,
    zIndex: 1001,
  } as ViewStyle,

  dropdownItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: BORDER_WIDTH.sm,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  } as ViewStyle,

  dropdownItemSelected: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  } as ViewStyle,

  // Flex layouts
  row: {
    flexDirection: 'row',
  } as ViewStyle,

  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,

  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});
/**
 * Common text styles
 */
export const TEXT_STYLES = StyleSheet.create({
  dropdownText: {
    color: COLOR_PALETTE.textPrimary,
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  dropdownItemText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,

  dropdownItemTextSelected: {
    color: COLOR_PALETTE.accentPrimary,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
  } as TextStyle,
});
