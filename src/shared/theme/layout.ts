import { Dimensions, ScaledSize } from 'react-native';
import { SPACING } from './spacing';

export type DeviceDimensions = {
  width: number;
  height: number;
  screenWidth: number;
  screenHeight: number;
  scale: number;
  fontScale: number;
};

const mapScaledSizesToDeviceDimensions = (
  windowMetrics: ScaledSize,
  screenMetrics: ScaledSize,
): DeviceDimensions => ({
  width: windowMetrics.width,
  height: windowMetrics.height,
  screenWidth: screenMetrics.width,
  screenHeight: screenMetrics.height,
  scale: windowMetrics.scale,
  fontScale: windowMetrics.fontScale,
});

export const createDeviceDimensionsSnapshot = (
  windowMetrics: ScaledSize,
  screenMetrics: ScaledSize,
): DeviceDimensions =>
  mapScaledSizesToDeviceDimensions(windowMetrics, screenMetrics);

export const getDeviceDimensions = (): DeviceDimensions =>
  mapScaledSizesToDeviceDimensions(
    Dimensions.get('window'),
    Dimensions.get('screen'),
  );

export const DEVICE_DIMENSIONS = getDeviceDimensions();
export const DEVICE_WIDTH = DEVICE_DIMENSIONS.width;
export const DEVICE_HEIGHT = DEVICE_DIMENSIONS.height;
export const SCREEN_WIDTH = DEVICE_DIMENSIONS.screenWidth;
export const SCREEN_HEIGHT = DEVICE_DIMENSIONS.screenHeight;
export const DEVICE_ASPECT_RATIO =
  DEVICE_WIDTH === 0 ? 0 : Number((DEVICE_HEIGHT / DEVICE_WIDTH).toFixed(2));

// Questionnaire layout constants for consistent horizontal spacing
export const QUESTIONNAIRE_HORIZONTAL_PADDING = 24; // SPACING.xl equivalent
export const QUESTIONNAIRE_MAX_CONTENT_WIDTH = 760;

export const TOUCH_TARGET_SIZE = 44;
export const INPUT_MIN_HEIGHT = 44;
export const ANSWER_TAB_MIN_HEIGHT = 80;
export const ANSWER_GRID_MIN_HEIGHT = 70;

export const FOOTER_LAYOUT = {
  FAB_SIZE: 64,
  FAB_BORDER_RADIUS: 32,
  FAB_OFFSET: -32,
  FAB_BORDER_WIDTH: 5,
  CONTAINER_BORDER_WIDTH: 3,
  CONTAINER_BORDER_RADIUS: 30,
  ICON_SIZE: 28,
  PLUS_ICON_SIZE: 32,
  BOTTOM_MARGIN: SPACING.xl,
};
