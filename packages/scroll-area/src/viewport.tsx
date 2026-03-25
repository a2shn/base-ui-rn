import { evaluateStyles, mergeRefs } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollView,
  type StyleProp,
  type TargetedEvent,
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
      'data-has-overflow-x': dataHasOverflowX,
      'data-has-overflow-y': dataHasOverflowY,
      'data-overflow-x-end': dataOverflowXEnd,
      'data-overflow-x-start': dataOverflowXStart,
      'data-overflow-y-end': dataOverflowYEnd,
      'data-overflow-y-start': dataOverflowYStart,
      'data-scrolling': dataScrolling,
      horizontal = false,
      measure = true,
      onLayout,
      style,
      ...other
    } = props;
    const {
      onBlur: handleBlur,
      onFocus: handleFocus,
      scrollX,
      scrollY,
      setIsScrolling,
      setViewportHeight,
      setViewportWidth,
      state,
      viewportRef,
    } = useScrollAreaContext();

    const mergedRef = mergeRefs(ref, measure ? viewportRef : undefined);

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

    const isWeb = Platform.OS === 'web';

    // On native, Viewport is the focus target but the Root renders the "ring" visuals
    // via an absolute overlay to prevent layout shifts.
    // On web, Viewport is NOT focusable and suppresses the default outline.
    const resolvedStyle = evaluateStyles(style, state, {
      disableDefaultFocusRing: true,
    });

    const webStyle: StyleProp<ViewStyle> = isWeb
      ? ({
          outline: 'none',
          touchAction: 'auto',
        } as unknown as ViewStyle)
      : {};

    const nativeProps = !isWeb
      ? {
          collapsable: false,
          focusable: true,
          onBlur: (e: NativeSyntheticEvent<TargetedEvent>) => {
            handleBlur();
            other.onBlur?.(e);
          },
          onFocus: (e: NativeSyntheticEvent<TargetedEvent>) => {
            handleFocus();
            other.onFocus?.(e);
          },
        }
      : {};

    return (
      <Animated.ScrollView
        {...other}
        {...nativeProps}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        contentContainerStyle={[
          { flexGrow: 1 },
          contentContainerStyle as StyleProp<ViewStyle>,
        ]}
        data-has-overflow-x={
          dataHasOverflowX ?? (state.hasOverflowX || undefined)
        }
        data-has-overflow-y={
          dataHasOverflowY ?? (state.hasOverflowY || undefined)
        }
        data-overflow-x-end={
          dataOverflowXEnd ?? (state.overflowXEnd || undefined)
        }
        data-overflow-x-start={
          dataOverflowXStart ?? (state.overflowXStart || undefined)
        }
        data-overflow-y-end={
          dataOverflowYEnd ?? (state.overflowYEnd || undefined)
        }
        data-overflow-y-start={
          dataOverflowYStart ?? (state.overflowYStart || undefined)
        }
        data-scrolling={dataScrolling ?? (state.isScrolling || undefined)}
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
        style={[{ flex: 1 }, resolvedStyle, webStyle]}
      >
        {children}
      </Animated.ScrollView>
    );
  }),
);

Viewport.displayName = 'ScrollArea.Viewport';
