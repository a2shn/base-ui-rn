import { Platform, type ViewStyle } from 'react-native';

export const getWebControlStyles = (): ViewStyle => {
  if (Platform.OS !== 'web') return {};
  return {
    touchAction: 'none',
    userSelect: 'none',
  } as ViewStyle;
};

export const getWebThumbStyles = (): ViewStyle => {
  if (Platform.OS !== 'web') return {};
  return { touchAction: 'none' } as ViewStyle;
};

export const getThumbDynamicStyles = (
  percent: number,
  orientation: 'horizontal' | 'vertical',
  thumbAlignment: 'center' | 'edge' | 'edge-client-only',
): ViewStyle => {
  const isHorizontal = orientation === 'horizontal';
  const isEdge = thumbAlignment === 'edge';

  if (isHorizontal) {
    return {
      left: `${percent}%`,
      position: 'absolute',
      transform: [{ translateX: isEdge ? `${-percent}%` : '-50%' }],
    };
  }

  return {
    bottom: `${percent}%`,
    position: 'absolute',
    transform: [{ translateY: isEdge ? `${percent}%` : '50%' }],
  };
};

export const getIndicatorDynamicStyles = (
  values: number[],
  min: number,
  max: number,
  orientation: 'horizontal' | 'vertical',
): ViewStyle => {
  const isRange = values.length > 1;
  const minValue = isRange ? (values[0] ?? min) : min;
  const maxValue = values[values.length - 1] ?? max;
  const range = max - min || 1;
  const start = ((minValue - min) / range) * 100;
  const end = ((maxValue - min) / range) * 100;
  const length = Math.max(end - start, 0);

  if (orientation === 'horizontal') {
    return {
      height: '100%',
      left: `${start}%`,
      position: 'absolute',
      width: `${length}%`,
    };
  }

  return {
    bottom: `${start}%`,
    height: `${length}%`,
    position: 'absolute',
    width: '100%',
  };
};
