import { mergeProps, mergeRefs, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  Platform,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { ScrollAreaViewportProps } from './types';
import { useScrollAreaViewport } from './use-scroll-area-viewport';

export const Viewport = React.memo(
  React.forwardRef<ScrollView, ScrollAreaViewportProps>((props, ref) => {
    const {
      children,
      contentContainerStyle,
      horizontal,
      style,
      ...otherProps
    } = props;

    const {
      handleKeyDown,
      handleLayout,
      handleScroll,
      handleScrollBegin,
      isFocusable,
      state,
      tabIndex,
      viewportRef,
    } = useScrollAreaViewport(props);

    const mergedRef = mergeRefs(
      ref,
      props.measure !== false ? viewportRef : undefined,
    );

    const isWeb = Platform.OS === 'web';
    const resolvedStyle = resolveValue(style, state);
    const webStyle: StyleProp<ViewStyle> = isWeb
      ? ({ outlineOffset: '-3px', touchAction: 'auto' } as any)
      : {};

    const mergedProps = mergeProps(
      {
        onLayout: handleLayout,
        onMomentumScrollBegin: handleScrollBegin,
        onScroll: handleScroll,
        onScrollBeginDrag: handleScrollBegin,
        ...(handleKeyDown ? { onKeyDown: handleKeyDown } : {}),
        contentContainerStyle: [
          horizontal
            ? ({ flexDirection: 'row', flexWrap: 'nowrap' } as const)
            : ({ flexGrow: 1 } as const),
          contentContainerStyle as StyleProp<ViewStyle>,
        ],
        style: [{ flex: 1 }, resolvedStyle, webStyle],
      },
      { ref: mergedRef },
      otherProps,
      {
        accessible: false,
        collapsable: false,
        horizontalScrollEventThrottle: 16,
        nestedScrollEnabled: true,
        scrollEnabled: true,
        scrollEventThrottle: 20,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      },
    );

    return (
      // Viewport is the tab stop: tabIndex + focusable live here so keyboard
      // focus lands on the ScrollView. onFocus/onBlur are omitted — they bubble
      // up to Root which drives state.focused and the native focus ring overlay.
      <Animated.ScrollView
        {...mergedProps}
        focusable={isFocusable}
        horizontal={horizontal}
        keyboardDismissMode='none'
        keyboardShouldPersistTaps='handled'
        tabIndex={tabIndex}
      >
        {children}
      </Animated.ScrollView>
    );
  }),
);

Viewport.displayName = 'ScrollArea.Viewport';