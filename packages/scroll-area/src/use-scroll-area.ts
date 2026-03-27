import { useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import { Animated, type ScrollView } from 'react-native';

import type { ScrollAreaRootProps, ScrollAreaRootState } from './types';

export type UseScrollAreaProps = ScrollAreaRootProps;

export function useScrollArea(props: UseScrollAreaProps) {
  const {
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    keyboardPageStep = 0.9,
    keyboardStep = 40,
    overflowEdgeThreshold = 0,
    scrollbarVisibility = 'auto',
    tabIndex,
  } = props;

  const [viewportWidth, setViewportWidth] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [contentWidth, setContentWidth] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [scrollbarWidth, setScrollbarWidth] = React.useState(0);
  const [scrollbarHeight, setScrollbarHeight] = React.useState(0);

  const [isScrolling, setIsScrolling] = React.useState(false);
  const scrollingTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

  const setScrolling = React.useCallback((s: boolean) => {
    if (scrollingTimeoutRef.current) {
      clearTimeout(scrollingTimeoutRef.current);
    }
    if (s) {
      setIsScrolling(true);
    }
    // Always schedule a fade-out after 1s of no "true" events
    scrollingTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, []);

  const [isHovering, setIsHovering] = React.useState(false);

  const {
    focused,
    focusRingStyle,
    isFocusable,
    onBlur,
    onFocus,
    tabIndex: resolvedTabIndex,
  } = useFocusRing({
    disabled: false,
    disableDefaultFocusRing,
    focusableWhenDisabled,
    tabIndex: tabIndex as 0 | -1 | undefined,
  });

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const viewportRef = React.useRef<ScrollView>(null);

  const rawScrollX = React.useRef(0);
  const rawScrollY = React.useRef(0);

  const [overflowDistances, setOverflowDistances] = React.useState({
    xEnd: 0,
    xStart: 0,
    yEnd: 0,
    yStart: 0,
  });

  const lastUpdateRef = React.useRef(0);

  const updateOverflowDistances = React.useCallback(
    (x: number, y: number) => {
      const now = Date.now();
      // Throttle updates to ~60fps (16ms) to improve performance during scrolling
      if (now - lastUpdateRef.current < 16) {
        return;
      }
      lastUpdateRef.current = now;

      setOverflowDistances({
        xEnd: Math.max(0, contentWidth - viewportWidth - x),
        xStart: x,
        yEnd: Math.max(0, contentHeight - viewportHeight - y),
        yStart: y,
      });
    },
    [contentWidth, viewportWidth, contentHeight, viewportHeight],
  );

  React.useEffect(() => {
    const idX = scrollX.addListener(({ value }) => {
      rawScrollX.current = value;
      updateOverflowDistances(value, rawScrollY.current);
    });
    const idY = scrollY.addListener(({ value }) => {
      rawScrollY.current = value;
      updateOverflowDistances(rawScrollX.current, value);
    });
    return () => {
      scrollX.removeListener(idX);
      scrollY.removeListener(idY);
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, [scrollX, scrollY, updateOverflowDistances]);

  const hasOverflowX = contentWidth > viewportWidth;
  const hasOverflowY = contentHeight > viewportHeight;

  const thresholds = React.useMemo(() => {
    if (typeof overflowEdgeThreshold === 'number') {
      return {
        xEnd: overflowEdgeThreshold,
        xStart: overflowEdgeThreshold,
        yEnd: overflowEdgeThreshold,
        yStart: overflowEdgeThreshold,
      };
    }
    return {
      xEnd: overflowEdgeThreshold.xEnd ?? 0,
      xStart: overflowEdgeThreshold.xStart ?? 0,
      yEnd: overflowEdgeThreshold.yEnd ?? 0,
      yStart: overflowEdgeThreshold.yStart ?? 0,
    };
  }, [overflowEdgeThreshold]);

  const overflowXStart = hasOverflowX && rawScrollX.current > thresholds.xStart;
  const overflowXEnd =
    hasOverflowX &&
    rawScrollX.current < contentWidth - viewportWidth - thresholds.xEnd;
  const overflowYStart = hasOverflowY && rawScrollY.current > thresholds.yStart;
  const overflowYEnd =
    hasOverflowY &&
    rawScrollY.current < contentHeight - viewportHeight - thresholds.yEnd;

  const isVisible = React.useMemo(() => {
    if (scrollbarVisibility === 'always') return true;
    if (scrollbarVisibility === 'scroll') return isScrolling;
    if (scrollbarVisibility === 'hover') return isHovering || isScrolling;
    return isScrolling || isHovering; // 'auto'
  }, [scrollbarVisibility, isScrolling, isHovering]);

  const thumbSizeX = React.useMemo(() => {
    if (scrollbarWidth === 0 || contentWidth === 0) return 0;
    const ratio = viewportWidth / contentWidth;
    const size = scrollbarWidth * ratio;
    return Math.min(Math.max(40, size), 100);
  }, [scrollbarWidth, contentWidth, viewportWidth]);

  const thumbSizeY = React.useMemo(() => {
    if (scrollbarHeight === 0 || contentHeight === 0) return 0;
    const ratio = viewportHeight / contentHeight;
    const size = scrollbarHeight * ratio;
    return Math.min(Math.max(40, size), 100);
  }, [scrollbarHeight, contentHeight, viewportHeight]);

  const state: ScrollAreaRootState = React.useMemo(
    () => ({
      corner: {
        height: scrollbarHeight,
        width: scrollbarWidth,
      },
      focused,
      hasOverflowX,
      hasOverflowY,
      isHovering,
      isScrolling,
      isVisible,
      overflow: overflowDistances,
      overflowXEnd,
      overflowXStart,
      overflowYEnd,
      overflowYStart,
      thumb: {
        height: thumbSizeY,
        width: thumbSizeX,
      },
    }),
    [
      focused,
      hasOverflowX,
      hasOverflowY,
      isScrolling,
      isHovering,
      isVisible,
      overflowXStart,
      overflowXEnd,
      overflowYStart,
      overflowYEnd,
      scrollbarHeight,
      scrollbarWidth,
      thumbSizeY,
      thumbSizeX,
      overflowDistances,
    ],
  );

  return React.useMemo(
    () => ({
      contentHeight,
      contentWidth,
      focusRingStyle,
      isFocusable,
      keyboardPageStep,
      keyboardStep,
      onBlur,
      onFocus,
      rawScrollX,
      rawScrollY,
      scrollbarHeight,
      scrollbarWidth,
      scrollX,
      scrollY,
      setContentHeight,
      setContentWidth,
      setIsHovering,
      setIsScrolling: setScrolling,
      setScrollbarHeight,
      setScrollbarWidth,
      setViewportHeight,
      setViewportWidth,
      state,
      tabIndex: resolvedTabIndex,
      viewportHeight,
      viewportRef,
      viewportWidth,
    }),
    [
      contentHeight,
      contentWidth,
      focusRingStyle,
      isFocusable,
      keyboardPageStep,
      keyboardStep,
      onBlur,
      onFocus,
      rawScrollX,
      rawScrollY,
      scrollbarHeight,
      scrollbarWidth,
      scrollX,
      scrollY,
      setScrolling,
      state,
      resolvedTabIndex,
      viewportHeight,
      viewportRef,
      viewportWidth,
    ],
  );
}
