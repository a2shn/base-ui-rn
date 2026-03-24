import { evaluateStyles, mergeRefs } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  Platform,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useScrollAreaContext } from './context';
import type { ScrollAreaViewportProps } from './types';

/**
 * The actual scrollable container of the scroll area.
 *
 * It captures scroll events and provides layout measurements for content and itself.
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
export const Viewport = React.memo(
  React.forwardRef<ScrollView, ScrollAreaViewportProps>((props, ref) => {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      contentContainerStyle,
      horizontal = false,
      measure = true,
      onLayout,
      style,
      ...other
    } = props;
    const {
      scrollX,
      scrollY,
      setIsScrolling,
      setViewportHeight,
      setViewportWidth,
      state,
      viewportRef,
    } = useScrollAreaContext();

    const mergedRef = mergeRefs(ref, viewportRef);

    const handleLayout = (event: LayoutChangeEvent) => {
      if (measure) {
        const { height, width } = event.nativeEvent.layout;
        setViewportWidth(width);
        setViewportHeight(height);
      }
      onLayout?.(event);
    };

    const handleScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset:
              Platform.OS === 'web'
                ? { x: scrollX, y: scrollY }
                : horizontal
                  ? { x: scrollX }
                  : { y: scrollY },
          },
        },
      ],
      {
        listener: () => {
          setIsScrolling(true);
        },
        useNativeDriver: Platform.OS !== 'web',
      },
    );

    const resolvedStyle = evaluateStyles(style, state);

    const webProps =
      Platform.OS === 'web'
        ? {
            focusable: true,
            tabIndex: 0 as 0 | -1,
          }
        : {};

    const webStyle: StyleProp<ViewStyle> =
      Platform.OS === 'web'
        ? ({ touchAction: 'auto' } as unknown as ViewStyle)
        : {};

    return (
      <Animated.ScrollView
        {...other}
        {...webProps}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        contentContainerStyle={[
          { flexGrow: 1 },
          contentContainerStyle as StyleProp<ViewStyle>,
        ]}
        horizontal={horizontal}
        nestedScrollEnabled
        onLayout={handleLayout}
        onMomentumScrollBegin={() => setIsScrolling(true)}
        onScroll={handleScroll}
        onScrollBeginDrag={() => setIsScrolling(true)}
        ref={mergedRef as React.Ref<ScrollView>}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={[resolvedStyle, webStyle]}
      >
        {children}
      </Animated.ScrollView>
    );
  }),
);

Viewport.displayName = 'ScrollArea.Viewport';
