import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import {
  type LayoutChangeEvent,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { useScrollAreaContext } from './context';
import type {
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarState,
} from './types';

export const ScrollbarContext = React.createContext<{
  orientation: 'horizontal' | 'vertical';
} | null>(null);

/**
 * A vertical or horizontal scrollbar for the scroll area.
 *
 * It acts as a track for the thumb and is only visible when there's overflow.
 *
 * @example
 * ```tsx
 * <ScrollArea.Scrollbar orientation="vertical">
 *   <ScrollArea.Thumb />
 * </ScrollArea.Scrollbar>
 * ```
 */
export const Scrollbar = React.memo(
  React.forwardRef<View, ScrollAreaScrollbarProps>((props, ref) => {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-orientation': ariaOrientationProp,
      children,
      'data-has-overflow-x': dataHasOverflowX,
      'data-has-overflow-y': dataHasOverflowY,
      'data-hovering': dataHovering,
      'data-orientation': dataOrientation,
      'data-overflow-x-end': dataOverflowXEnd,
      'data-overflow-x-start': dataOverflowXStart,
      'data-overflow-y-end': dataOverflowYEnd,
      'data-overflow-y-start': dataOverflowYStart,
      'data-scrolling': dataScrolling,
      keepMounted = false,
      onLayout,
      orientation = 'vertical',
      style,
      ...other
    } = props;

    const { setScrollbarHeight, setScrollbarWidth, state } =
      useScrollAreaContext();

    const scrollbarState: ScrollAreaScrollbarState = React.useMemo(
      () => ({ ...state, orientation }),
      [state, orientation],
    );

    const handleLayout = (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      if (orientation === 'horizontal') {
        setScrollbarWidth(width);
      } else {
        setScrollbarHeight(height);
      }
      onLayout?.(event);
    };

    let isVisible = state.hasOverflowY;
    if (orientation === 'horizontal') {
      isVisible = state.hasOverflowX;
    }

    if (keepMounted) {
      isVisible = true;
    }

    if (!isVisible) {
      return null;
    }

    const resolvedStyle = evaluateStyles(style, scrollbarState, {
      disableDefaultFocusRing: true,
    });

    const isWeb = Platform.OS === 'web';
    let webStyle: StyleProp<ViewStyle> = {};
    if (isWeb) {
      webStyle = { touchAction: 'none' } as ViewStyle;
    }

    const scrollbarDataAttrs = {
      'data-has-overflow-x':
        dataHasOverflowX ?? (state.hasOverflowX || undefined),
      'data-has-overflow-y':
        dataHasOverflowY ?? (state.hasOverflowY || undefined),
      'data-hovering': dataHovering ?? (state.isHovering || undefined),
      'data-orientation': dataOrientation ?? orientation,
      'data-overflow-x-end':
        dataOverflowXEnd ?? (state.overflowXEnd || undefined),
      'data-overflow-x-start':
        dataOverflowXStart ?? (state.overflowXStart || undefined),
      'data-overflow-y-end':
        dataOverflowYEnd ?? (state.overflowYEnd || undefined),
      'data-overflow-y-start':
        dataOverflowYStart ?? (state.overflowYStart || undefined),
      'data-scrolling': dataScrolling ?? (state.isScrolling || undefined),
    };

    return (
      <ScrollbarContext.Provider value={{ orientation }}>
        <View
          {...other}
          {...scrollbarDataAttrs}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-orientation={ariaOrientationProp ?? orientation}
          focusable={false}
          onLayout={handleLayout}
          ref={ref}
          role='scrollbar'
          style={[resolvedStyle, webStyle]}
        >
          {children}
        </View>
      </ScrollbarContext.Provider>
    );
  }),
);

Scrollbar.displayName = 'ScrollArea.Scrollbar';
