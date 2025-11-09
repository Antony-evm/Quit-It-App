import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

import {
  DEVICE_DIMENSIONS,
  DeviceDimensions,
  createDeviceDimensionsSnapshot,
} from '../theme/layout';

type DimensionChangePayload = {
  window: ScaledSize;
  screen: ScaledSize;
};

export const useDeviceDimensions = (): DeviceDimensions => {
  const [dimensions, setDimensions] = useState<DeviceDimensions>(DEVICE_DIMENSIONS);

  useEffect(() => {
    const handleDimensionChange = ({ window, screen }: DimensionChangePayload) => {
      setDimensions(createDeviceDimensionsSnapshot(window, screen));
    };

    const subscription = Dimensions.addEventListener('change', handleDimensionChange);

    return () => {
      subscription?.remove?.();
    };
  }, []);

  return dimensions;
};
