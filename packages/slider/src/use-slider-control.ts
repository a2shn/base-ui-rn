import { evaluateStyles, resolveTabIndex } from '@base-ui-rn/core';
import * as React from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  type View,
  type ViewStyle,
} from 'react-native';

import { useSliderContext } from './context';
import type { SliderPartProps } from './types';
import { useSliderGestures } from './use-slider-gestures';

export interface SliderControlOptions extends Pick<SliderPartProps, 'style'> {
  /**
   * Callback for layout changes.
   */
  onLayout?: (event: LayoutChangeEvent) => void;
}

export interface SliderControlReturn {
  mergedRef: React.RefCallback<View>;
  panHandlers: import('react-native').GestureResponderHandlers;
  handleLayout: (event: LayoutChangeEvent) => void;
  resolvedStyle: ViewStyle | ViewStyle[] | undefined;
  resolvedTabIndex: number | undefined;
  'data-dragging'?: boolean;
  'data-orientation'?: 'horizontal' | 'vertical';
  'data-disabled'?: boolean;
  'data-focused'?: boolean;
}

/**
 * Manages the state and logic for the SliderControl component.
 * @param options Configuration options for the slider control.
 * @returns State and event handlers for the control component.
 */
export function useSliderControl(options: SliderControlOptions = {}) {
  const { onLayout, style } = options;

  const {
    commitValue,
    focusedThumbIndex,
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

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setTrackSize(isHorizontal ? width : height);

      if (!isWeb) {
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

  const resolvedStyle = React.useMemo(() => {
    const evaluated = evaluateStyles(style, state);
    if (isWeb) {
      const webSpecific = {
        touchAction: 'none',
        userSelect: 'none',
      } as ViewStyle;
      if (Array.isArray(evaluated)) {
        return [webSpecific, ...evaluated];
      }
      return [webSpecific, evaluated];
    }
    return evaluated;
  }, [style, state, isWeb]);

  const resolvedTabIndex = resolveTabIndex(state.disabled, -1);

  return {
    'data-disabled': state.disabled ? 'true' : undefined,
    'data-dragging': state.dragging ? 'true' : undefined,
    'data-focused': focusedThumbIndex !== null ? 'true' : undefined,
    'data-orientation': state.orientation,
    handleLayout,
    mergedRef,
    panHandlers,
    resolvedStyle,
    resolvedTabIndex,
  };
}
