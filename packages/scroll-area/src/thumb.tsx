import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { useScrollAreaContext } from './context';
import { ScrollbarContext } from './scrollbar';
import type { ScrollAreaThumbProps, ScrollAreaThumbState } from './types';

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

    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
      if (Platform.OS !== 'web' || !isDragging) return;

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
      if (!doc?.body) return;

      const originalCursor = doc.body.style.cursor;
      const originalUserSelect = doc.body.style.userSelect;

      doc.body.style.cursor = 'grabbing';
      doc.body.style.userSelect = 'none';

      return () => {
        doc.body.style.cursor = originalCursor;
        doc.body.style.userSelect = originalUserSelect;
      };
    }, [isDragging]);

    // Stable refs for gesture logic
    const contentDimRef = React.useRef(0);
    const viewportDimRef = React.useRef(0);
    const scrollbarDimRef = React.useRef(0);
    const initialScrollRef = React.useRef(0);
    const isHorizontal = orientation === 'horizontal';

    contentDimRef.current = isHorizontal ? contentWidth : contentHeight;
    viewportDimRef.current = isHorizontal ? viewportWidth : viewportHeight;
    scrollbarDimRef.current = isHorizontal ? scrollbarWidth : scrollbarHeight;

    const thumbSize = React.useMemo(() => {
      if (scrollbarDimRef.current === 0 || contentDimRef.current === 0)
        return 0;
      const ratio = viewportDimRef.current / contentDimRef.current;
      // Minimum thumb size of 40px, maximum of 100px
      const size = scrollbarDimRef.current * ratio;
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

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: (_, gestureState) => {
            const { dx, dy } = gestureState;
            const isFarEnough = isHorizontal
              ? Math.abs(dx) > 2
              : Math.abs(dy) > 2;
            const isCorrectDirection = isHorizontal
              ? Math.abs(dx) > Math.abs(dy)
              : Math.abs(dy) > Math.abs(dx);
            return isFarEnough && isCorrectDirection;
          },
          onPanResponderGrant: () => {
            setIsDragging(true);
            setIsScrolling(true);
            initialScrollRef.current = isHorizontal
              ? rawScrollX.current
              : rawScrollY.current;
          },
          onPanResponderMove: (_, gestureState) => {
            if (scrollbarDimRef.current === thumbSize) return;

            const scrollRange = contentDimRef.current - viewportDimRef.current;
            const scrollbarRange = scrollbarDimRef.current - thumbSize;

            if (scrollbarRange <= 0) return;

            // How much scroll changes per pixel of drag
            const ratio = scrollRange / scrollbarRange;
            const dragPos = isHorizontal ? gestureState.dx : gestureState.dy;

            const nextScroll = Math.max(
              0,
              Math.min(scrollRange, initialScrollRef.current + dragPos * ratio),
            );

            viewportRef.current?.scrollTo({
              animated: false,
              x: isHorizontal ? nextScroll : rawScrollX.current,
              y: isHorizontal ? rawScrollY.current : nextScroll,
            });
            setIsScrolling(true);
          },
          onPanResponderRelease: () => {
            setIsDragging(false);
          },
          onPanResponderTerminate: () => {
            setIsDragging(false);
          },
          onStartShouldSetPanResponder: () => false,
        }),
      [
        isHorizontal,
        thumbSize,
        viewportRef,
        rawScrollX,
        rawScrollY,
        setIsScrolling,
      ],
    );

    const thumbState: ScrollAreaThumbState = React.useMemo(
      () => ({ isDragging, orientation }),
      [orientation, isDragging],
    );

    const transform = React.useMemo(() => {
      if (isHorizontal) {
        const range = contentWidth - viewportWidth;
        if (range <= 0) return [{ translateX: 0 }];
        return [
          {
            translateX: scrollX.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, range],
              outputRange: [0, scrollbarWidth - thumbSize],
            }),
          },
        ];
      } else {
        const range = contentHeight - viewportHeight;
        if (range <= 0) return [{ translateY: 0 }];
        return [
          {
            translateY: scrollY.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, range],
              outputRange: [0, scrollbarHeight - thumbSize],
            }),
          },
        ];
      }
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

    const resolvedStyle = evaluateStyles(style, thumbState, {
      disableDefaultFocusRing: true,
    });

    const sizeStyle: StyleProp<ViewStyle> = isHorizontal
      ? { height: '100%', width: thumbSize }
      : { height: thumbSize, width: '100%' };

    const webStyle = Platform.select({
      default: {},
      web: {
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      } as unknown as ViewStyle,
    });

    return (
      <Animated.View
        {...other}
        {...panResponder.panHandlers}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
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
