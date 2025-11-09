import { Dimensions, ScaledSize } from 'react-native';

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
): DeviceDimensions => mapScaledSizesToDeviceDimensions(windowMetrics, screenMetrics);

export const getDeviceDimensions = (): DeviceDimensions =>
  mapScaledSizesToDeviceDimensions(Dimensions.get('window'), Dimensions.get('screen'));

export const DEVICE_DIMENSIONS = getDeviceDimensions();
export const DEVICE_WIDTH = DEVICE_DIMENSIONS.width;
export const DEVICE_HEIGHT = DEVICE_DIMENSIONS.height;
export const SCREEN_WIDTH = DEVICE_DIMENSIONS.screenWidth;
export const SCREEN_HEIGHT = DEVICE_DIMENSIONS.screenHeight;
export const DEVICE_ASPECT_RATIO =
  DEVICE_WIDTH === 0 ? 0 : Number((DEVICE_HEIGHT / DEVICE_WIDTH).toFixed(2));
