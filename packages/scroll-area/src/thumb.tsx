import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Animated, Platform, View, type StyleProp, type ViewStyle } from 'react-native';

import type { ScrollAreaThumbProps } from './types';
import { useScrollAreaThumb } from './use-scroll-area-thumb';

export const Thumb = React.memo(
  React.forwardRef<View, ScrollAreaThumbProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const { thumbState, thumbSize, transform, panHandlers, isDragging, isHorizontal } = useScrollAreaThumb();

    const resolvedStyle = resolveValue(style, thumbState);
    const sizeStyle: StyleProp<ViewStyle> = isHorizontal ? { height: '100%', width: thumbSize } : { height: thumbSize, width: '100%' };
    const webStyle: ViewStyle = Platform.OS === 'web' ? { cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' } as unknown as ViewStyle : {};


    const mergedProps = mergeProps({
      ...panHandlers,
      style: [sizeStyle, resolvedStyle, webStyle, { transform }],
    }, { ref }, otherProps, { focusable: false });

    return (
      <Animated.View {...mergedProps}>
        {children}
      </Animated.View>
    );
  }),
);

Thumb.displayName = 'ScrollArea.Thumb';