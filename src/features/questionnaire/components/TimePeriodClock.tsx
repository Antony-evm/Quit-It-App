import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLOR_PALETTE } from '@/shared/theme';

type TimePeriodClockProps = {
  startHour: number;
  endHour: number;
  size?: number;
  circleStroke?: string;
  fillOpacity?: number;
  padding?: number;
};

const polarPoint = (center: number, radius: number, hour: number) => {
  const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
};

const buildArcPath = (
  size: number,
  startHour: number,
  endHour: number,
  padding: number,
) => {
  const radius = size / 2 - padding;
  const center = size / 2;
  const clampedStart = Math.max(0, Math.min(startHour, 24));
  const clampedEnd = Math.max(0, Math.min(endHour, 24));
  const arcEnd = clampedEnd <= clampedStart ? clampedStart + 0.1 : clampedEnd;

  const start = polarPoint(center, radius, clampedStart);
  const end = polarPoint(center, radius, arcEnd);

  const arcSpan = arcEnd - clampedStart;
  const largeArcFlag = arcSpan > 12 ? 1 : 0;

  return {
    d: [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' '),
  };
};

export const TimePeriodClock = ({
  startHour,
  endHour,
  size = 60,
  circleStroke = COLOR_PALETTE.backgroundPrimary,
  fillOpacity = 0.75,
  padding = 4,
}: TimePeriodClockProps) => {
  const { d } = buildArcPath(size, startHour, endHour, padding);
  const radius = size / 2 - padding;
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        fill={COLOR_PALETTE.backgroundMuted}
        stroke={circleStroke}
        strokeWidth={4}
      />
      <Path
        d={d}
        fill={COLOR_PALETTE.accentPrimary}
        fillOpacity={fillOpacity}
        stroke={COLOR_PALETTE.accentPrimary}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
};
