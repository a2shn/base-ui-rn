import * as React from 'react';
import { type LayoutChangeEvent, View } from 'react-native';

import { useScrollAreaContext } from './context';
import type { ScrollAreaContentProps } from './types';

/**
 * A container for the content of the scroll area.
 *
 * It is used to measure the size of the content for scrollbar calculation.
 *
 * @example
 * ```tsx
 * <ScrollArea.Root>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content />
 *   </ScrollArea.Viewport>
 * </ScrollArea.Root>
 * ```
 */
export const Content = React.memo(
  React.forwardRef<View, ScrollAreaContentProps>((props, ref) => {
    const { children, onLayout, ...other } = props;
    const { setContentHeight, setContentWidth, state } = useScrollAreaContext();

    const handleLayout = (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setContentWidth(width);
      setContentHeight(height);
      onLayout?.(event);
    };

    const contentDataAttrs = {
      'data-has-overflow-x': state.hasOverflowX || undefined,
      'data-has-overflow-y': state.hasOverflowY || undefined,
      'data-overflow-x-end': state.overflowXEnd || undefined,
      'data-overflow-x-start': state.overflowXStart || undefined,
      'data-overflow-y-end': state.overflowYEnd || undefined,
      'data-overflow-y-start': state.overflowYStart || undefined,
      'data-scrolling': state.isScrolling || undefined,
    };

    return (
      <View {...other} {...contentDataAttrs} onLayout={handleLayout} ref={ref}>
        {children}
      </View>
    );
  }),
);

Content.displayName = 'ScrollArea.Content';
