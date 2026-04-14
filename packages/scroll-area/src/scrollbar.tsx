import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';

import type { ScrollAreaScrollbarProps } from './types';
import { useScrollAreaScrollbar } from './use-scroll-area-scrollbar';

export const ScrollbarContext = React.createContext<{
  orientation: 'horizontal' | 'vertical';
} | null>(null);

/**
 * The track that contains the draggable thumb.
 *
 * @example
 * ```tsx
 * <ScrollArea.Scrollbar orientation="vertical">
 * <ScrollArea.Thumb />
 * </ScrollArea.Scrollbar>
 * ```
 */
export const Scrollbar = React.memo(
  React.forwardRef<View, ScrollAreaScrollbarProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      handleLayout,
      isVisible,
      orientation: resolvedOrientation,
      scrollbarState,
    } = useScrollAreaScrollbar(props);

    if (!isVisible) return null;

    const resolvedStyle = resolveValue(style, scrollbarState);
    const webStyle: StyleProp<ViewStyle> =
      Platform.OS === 'web' ? ({ touchAction: 'none' } as ViewStyle) : {};

    const internalProps = {
      onLayout: handleLayout,
      style: [resolvedStyle, webStyle],
    };

    const mergedProps = mergeProps(internalProps, { ref }, otherProps, {
      focusable: false,
      role: 'scrollbar',
    });

    return (
      <ScrollbarContext.Provider value={{ orientation: resolvedOrientation }}>
        <View {...mergedProps}>{children}</View>
      </ScrollbarContext.Provider>
    );
  }),
);

Scrollbar.displayName = 'ScrollArea.Scrollbar';
