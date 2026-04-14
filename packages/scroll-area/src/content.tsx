import { mergeProps } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { ScrollAreaContentProps } from './types';
import { useScrollAreaContent } from './use-scroll-area-content';

/**
 * Wrapper for the scrollable content inside the viewport.
 *
 * Handles layout measurements required for accurate scrollbar track sizing.
 *
 * @example
 * ```tsx
 * <ScrollArea.Viewport>
 * <ScrollArea.Content>
 * <Text>Scrollable content...</Text>
 * </ScrollArea.Content>
 * </ScrollArea.Viewport>
 * ```
 */
export const Content = React.memo(
  React.forwardRef<View, ScrollAreaContentProps>((props, ref) => {
    const { children, ...otherProps } = props;
    const { handleLayout } = useScrollAreaContent();

    const mergedProps = mergeProps(
      { onLayout: handleLayout },
      { ref },
      otherProps,
    );

    return <View {...mergedProps}>{children}</View>;
  }),
);

Content.displayName = 'ScrollArea.Content';
