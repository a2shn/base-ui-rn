import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, type StyleProp, View, type ViewStyle } from 'react-native';

import type { ScrollAreaScrollbarProps } from './types';
import { useScrollAreaScrollbar } from './use-scroll-area-scrollbar';

export const ScrollbarContext = React.createContext<{ orientation: 'horizontal' | 'vertical' } | null>(null);

export const Scrollbar = React.memo(
  React.forwardRef<View, ScrollAreaScrollbarProps>((props, ref) => {
    const { children, keepMounted, onLayout, orientation, style, ...otherProps } = props;

    const { scrollbarState, handleLayout, isVisible, orientation: resolvedOrientation } = useScrollAreaScrollbar(props);

    if (!isVisible) return null;

    const resolvedStyle = resolveValue(style, scrollbarState);
    const webStyle: StyleProp<ViewStyle> = Platform.OS === 'web' ? { touchAction: 'none' } as ViewStyle : {};

    const internalProps = {
      onLayout: handleLayout,
      style: [resolvedStyle, webStyle],
    };

    const mergedProps = mergeProps(internalProps, { ref }, otherProps, { focusable: false, role: 'scrollbar' });

    return (
      <ScrollbarContext.Provider value={{ orientation: resolvedOrientation }}>
        <View {...mergedProps}>
          {children}
        </View>
      </ScrollbarContext.Provider>
    );
  }),
);

Scrollbar.displayName = 'ScrollArea.Scrollbar';