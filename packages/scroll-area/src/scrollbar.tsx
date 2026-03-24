import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

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

    const isVisible =
      keepMounted ||
      (orientation === 'horizontal' ? state.hasOverflowX : state.hasOverflowY);

    if (!isVisible) {
      return null;
    }

    const resolvedStyle = evaluateStyles(style, scrollbarState);

    const webStyle: StyleProp<ViewStyle> =
      Platform.OS === 'web' ? ({ touchAction: 'none' } as any) : {};

    return (
      <ScrollbarContext.Provider value={{ orientation }}>
        <View
          {...other}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-orientation={ariaOrientationProp ?? orientation}
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
