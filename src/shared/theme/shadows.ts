import { ViewStyle } from 'react-native';
import { SYSTEM } from './colors';

/**
 * Shared shadow styles for consistent elevation and depth across the app.
 * Based on existing usage in BottomDrawer, HomeFooterNavigator, and common styles.
 */
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  } as ViewStyle,

  /**
   * Small shadow (elevation 2)
   * Used for: Cards, small elements
   */
  sm: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  } as ViewStyle,

  /**
   * Medium shadow (elevation 5)
   * Used for: Dropdowns, elevated surfaces, title containers
   */
  md: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  } as ViewStyle,

  /**
   * Large shadow (elevation 8)
   * Used for: Navigation bars, footers
   */
  lg: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  } as ViewStyle,

  /**
   * Soft large shadow (elevation 8)
   * Used for: Cards with soft depth
   */
  softLg: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,

  /**
   * Soft extra large shadow (elevation 10)
   * Used for: Answer grids
   */
  softXl: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  } as ViewStyle,

  /**
   * Extra large shadow (elevation 10)
   * Used for: Bottom sheets, modals
   */
  xl: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
  } as ViewStyle,

  /**
   * Extra extra large shadow (elevation 12)
   * Used for: Floating Action Buttons (FAB), high emphasis elements
   */
  xxl: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 12,
  } as ViewStyle,

  /**
   * Ambient glow shadow (elevation 8)
   * Used for: Account section cards with soft ambient glow
   */
  ambientGlow: {
    shadowColor: SYSTEM.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  } as ViewStyle,
} as const;

export type ShadowSize = keyof typeof SHADOWS;
