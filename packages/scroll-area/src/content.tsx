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
    const { setContentHeight, setContentWidth } = useScrollAreaContext();

    const handleLayout = (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setContentWidth(width);
      setContentHeight(height);
      onLayout?.(event);
    };

    return (
      <View {...other} onLayout={handleLayout} ref={ref}>
        {children}
      </View>
    );
  }),
);

Content.displayName = 'ScrollArea.Content';
