import { mergeProps, mergeRefs, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  Platform,
  View,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { ScrollAreaViewportProps } from './types';
import { useScrollAreaViewport } from './use-scroll-area-viewport';

export const Viewport = React.memo(
  React.forwardRef<ScrollView, ScrollAreaViewportProps>((props, ref) => {
    const { children, contentContainerStyle, horizontal, measure, onLayout, style, onBlur, onFocus, ...otherProps } = props;

    const {
      state,
      viewportRef,
      handleLayout,
      handleScroll,
      handleScrollBegin,
      handleBlur,
      handleFocus,
    } = useScrollAreaViewport(props);

    const mergedRef = mergeRefs(ref, props.measure !== false ? viewportRef : undefined);
    const isWeb = Platform.OS === 'web';

    const resolvedStyle = resolveValue(style, state);
    const webStyle: StyleProp<ViewStyle> = isWeb ? { outlineStyle: 'none', touchAction: 'auto' } as any : {};

    const mergedProps = mergeProps(
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onLayout: handleLayout,
        onMomentumScrollBegin: handleScrollBegin,
        onScroll: handleScroll,
        onScrollBeginDrag: handleScrollBegin,
        style: [{ flex: 1 }, resolvedStyle, webStyle],
        contentContainerStyle: [horizontal ? ({ flexDirection: 'row', flexWrap: 'nowrap' } as const) : ({ flexGrow: 1 } as const), contentContainerStyle as StyleProp<ViewStyle>]
      },
      { ref: mergedRef },
      otherProps,
      {
        collapsable: false,
        horizontalScrollEventThrottle: 16,
        nestedScrollEnabled: true,
        scrollEnabled: true,
        scrollEventThrottle: 20,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        accessible: false,
      }
    );

    return (
      <Animated.ScrollView {...mergedProps}
        horizontal={horizontal}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        {children}
      </Animated.ScrollView>
    );
  }),
);

Viewport.displayName = 'ScrollArea.Viewport';