import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  Platform,
  type ScrollView,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { useScrollAreaContext } from './context';
import { ScrollbarContext } from './scrollbar';
import type { ScrollAreaThumbProps, ScrollAreaThumbState } from './types';
import { useGesture } from './use-gesture';

/**
 * The part of the scrollbar that indicates the current scroll position.
 *
 * It is positioned relative to the scrollbar based on scroll progress.
 *
 * @example
 * ```tsx
 * <ScrollArea.Scrollbar>
 *   <ScrollArea.Thumb />
 * </ScrollArea.Scrollbar>
 * ```
 */
export const Thumb = React.memo(
  React.forwardRef<View, ScrollAreaThumbProps>((props, ref) => {
    const {
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      style,
      ...other
    } = props;
    const context = useScrollAreaContext();
    const scrollbarContext = React.useContext(ScrollbarContext);

    if (!scrollbarContext) {
      throw new Error(
        'ScrollArea.Thumb must be used within a ScrollArea.Scrollbar',
      );
    }

    const { orientation } = scrollbarContext;
    const {
      contentHeight,
      contentWidth,
      rawScrollX,
      rawScrollY,
      scrollbarHeight,
      scrollbarWidth,
      scrollX,
      scrollY,
      setIsScrolling,
      viewportHeight,
      viewportRef,
      viewportWidth,
    } = context;

    const isHorizontal = orientation === 'horizontal';

    const thumbSize = React.useMemo(() => {
      let scrollbarDim = scrollbarHeight;
      let contentDim = contentHeight;
      let viewportDim = viewportHeight;

      if (isHorizontal) {
        scrollbarDim = scrollbarWidth;
        contentDim = contentWidth;
        viewportDim = viewportWidth;
      }

      if (scrollbarDim === 0 || contentDim === 0) {
        return 0;
      }

      const ratio = viewportDim / contentDim;
      // Minimum thumb size of 40px, maximum of 100px
      const size = scrollbarDim * ratio;
      return Math.min(Math.max(40, size), 100);
    }, [
      isHorizontal,
      contentWidth,
      viewportWidth,
      scrollbarWidth,
      contentHeight,
      viewportHeight,
      scrollbarHeight,
    ]);

    const { isDragging, panHandlers } = useGesture({
      contentHeight,
      contentWidth,
      orientation,
      rawScrollX,
      rawScrollY,
      scrollbarHeight,
      scrollbarWidth,
      setIsScrolling,
      thumbSize,
      viewportHeight,
      viewportRef: viewportRef as React.RefObject<ScrollView | null>,
      viewportWidth,
    });

    React.useEffect(() => {
      if (Platform.OS !== 'web' || !isDragging) {
        return;
      }

      const doc = (
        globalThis as unknown as {
          document?: {
            body: {
              style: {
                cursor: string | null;
                userSelect: string | null;
              };
            };
          };
        }
      ).document;

      if (!doc?.body) {
        return;
      }

      const originalCursor = doc.body.style.cursor;
      const originalUserSelect = doc.body.style.userSelect;

      doc.body.style.cursor = 'grabbing';
      doc.body.style.userSelect = 'none';

      return () => {
        doc.body.style.cursor = originalCursor;
        doc.body.style.userSelect = originalUserSelect;
      };
    }, [isDragging]);

    const thumbState: ScrollAreaThumbState = React.useMemo(
      () => ({ isDragging, orientation }),
      [orientation, isDragging],
    );

    const transform = React.useMemo(() => {
      if (isHorizontal) {
        const range = contentWidth - viewportWidth;
        if (range <= 0) {
          return [{ translateX: 0 }];
        }
        return [
          {
            translateX: scrollX.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, range],
              outputRange: [0, scrollbarWidth - thumbSize],
            }),
          },
        ];
      }

      const range = contentHeight - viewportHeight;
      if (range <= 0) {
        return [{ translateY: 0 }];
      }
      return [
        {
          translateY: scrollY.interpolate({
            extrapolate: 'clamp',
            inputRange: [0, range],
            outputRange: [0, scrollbarHeight - thumbSize],
          }),
        },
      ];
    }, [
      isHorizontal,
      contentWidth,
      viewportWidth,
      scrollbarWidth,
      thumbSize,
      contentHeight,
      viewportHeight,
      scrollbarHeight,
      scrollX,
      scrollY,
    ]);

    const resolvedStyle = evaluateStyles(style, thumbState);

    let sizeStyle: StyleProp<ViewStyle> = { height: thumbSize, width: '100%' };
    if (isHorizontal) {
      sizeStyle = { height: '100%', width: thumbSize };
    }

    const isWeb = Platform.OS === 'web';
    let webStyle: ViewStyle = {};
    if (isWeb) {
      webStyle = {
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      } as unknown as ViewStyle;
    }

    return (
      <Animated.View
        {...other}
        {...panHandlers}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-orientation={orientation}
        focusable={false}
        ref={ref as React.Ref<View>}
        style={[sizeStyle, resolvedStyle, webStyle, { transform }]}
      >
        {children}
      </Animated.View>
    );
  }),
);

Thumb.displayName = 'ScrollArea.Thumb';
