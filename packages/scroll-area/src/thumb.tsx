import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import type { ScrollAreaThumbProps } from './types';
import { useScrollAreaThumb } from './use-scroll-area-thumb';

/**
 * The draggable handle within the scrollbar.
 *
 * Supports pointer drag interactions to scroll the viewport.
 *
 * @example
 * ```tsx
 * <ScrollArea.Scrollbar>
 * <ScrollArea.Thumb />
 * </ScrollArea.Scrollbar>
 * ```
 */
export const Thumb = React.memo(
  React.forwardRef<View, ScrollAreaThumbProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      isDragging,
      isHorizontal,
      panHandlers,
      thumbSize,
      thumbState,
      transform,
    } = useScrollAreaThumb();

    const resolvedStyle = resolveValue(style, thumbState);
    const sizeStyle: StyleProp<ViewStyle> = isHorizontal
      ? { height: '100%', width: thumbSize }
      : { height: thumbSize, width: '100%' };
    const webStyle: ViewStyle =
      Platform.OS === 'web'
        ? ({
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          } as unknown as ViewStyle)
        : {};

    const mergedProps = mergeProps(
      {
        ...panHandlers,
        style: [sizeStyle, resolvedStyle, webStyle, { transform }],
      },
      { ref },
      otherProps,
      { focusable: false },
    );

    return <Animated.View {...mergedProps}>{children}</Animated.View>;
  }),
);

Thumb.displayName = 'ScrollArea.Thumb';
