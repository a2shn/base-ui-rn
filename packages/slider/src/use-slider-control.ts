import { resolveTabIndex } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import { type LayoutChangeEvent, Platform, type View } from 'react-native';

import { useSliderContext } from './context';
import { useSliderGestures } from './use-slider-gestures';

export interface SliderControlOptions {
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function useSliderControl(options: SliderControlOptions = {}) {
  const { onLayout } = options;

  const {
    commitValue,
    focusThumb,
    setDragging,
    setTrackSize,
    setValueAtIndex,
    state,
  } = useSliderContext();

  const isHorizontal = state.orientation === 'horizontal';
  const isWeb = Platform.OS === 'web';

  const layoutRef = React.useRef({ height: 0, width: 0, x: 0, y: 0 });
  const innerRef = React.useRef<View>(null);

  const handleOnLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setTrackSize(isHorizontal ? width : height);

      if (!isWeb && event.target) {
        (
          event.target as unknown as {
            measureInWindow: (
              cb: (x: number, y: number, width: number, height: number) => void,
            ) => void;
          }
        ).measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            layoutRef.current = { ...layoutRef.current, height, width, x, y };
          },
        );
      }
      onLayout?.(event);
    },
    [isHorizontal, isWeb, setTrackSize, onLayout],
  );

  const { panHandlers } = useSliderGestures({
    commitValue,
    containerRef: innerRef,
    focusThumb,
    isHorizontal,
    isWeb,
    layoutRef,
    setDragging,
    setValueAtIndex,
    state,
  });

  const mergedRef = React.useCallback((node: View | null) => {
    innerRef.current = node;
  }, []);

  const tabIndex = resolveTabIndex(state.disabled, -1);

  return {
    handleOnLayout,
    mergedRef,
    panHandlers,
    tabIndex,
  };
}
