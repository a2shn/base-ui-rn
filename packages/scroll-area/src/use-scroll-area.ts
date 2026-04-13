import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import { Animated, type ScrollView } from 'react-native';

import type { ScrollAreaRootProps, ScrollAreaRootState } from './types';

export function useScrollArea(props: ScrollAreaRootProps) {
  const {
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    keyboardPageStep = 0.9,
    keyboardStep = 40,
    overflowEdgeThreshold = 0,
    scrollbarVisibility = 'auto',
    tabIndex: tabIndexProp,
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
    if (scrollingTimeoutRef.current) clearTimeout(scrollingTimeoutRef.current);
    if (s) setIsScrolling(true);
    scrollingTimeoutRef.current = setTimeout(() => setIsScrolling(false), 1000);
  }, []);

  const [isHovering, setIsHovering] = React.useState(false);

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur,
    onFocus,
  } = useFocusRing({
    disabled: false,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  // Viewport will read isFocusable + tabIndex from context to set its own focusable/tabIndex
  const tabIndex = resolveTabIndex(
    isFocusable,
    tabIndexProp as 0 | -1 | undefined,
  );

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
      if (now - lastUpdateRef.current < 150) return;
      lastUpdateRef.current = now;
      setOverflowDistances((prev) => {
        const nextXEnd = Math.max(0, contentWidth - viewportWidth - x);
        const nextYEnd = Math.max(0, contentHeight - viewportHeight - y);
        if (
          Math.abs(prev.xStart - x) < 2 &&
          Math.abs(prev.yStart - y) < 2 &&
          Math.abs(prev.xEnd - nextXEnd) < 2 &&
          Math.abs(prev.yEnd - nextYEnd) < 2
        ) {
          return prev;
        }
        return { xEnd: nextXEnd, xStart: x, yEnd: nextYEnd, yStart: y };
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
      if (scrollingTimeoutRef.current)
        clearTimeout(scrollingTimeoutRef.current);
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
    return isScrolling || isHovering;
  }, [scrollbarVisibility, isScrolling, isHovering]);

  const thumbSizeX = React.useMemo(() => {
    if (scrollbarWidth === 0 || contentWidth === 0) return 0;
    return Math.min(
      Math.max(40, scrollbarWidth * (viewportWidth / contentWidth)),
      100,
    );
  }, [scrollbarWidth, contentWidth, viewportWidth]);

  const thumbSizeY = React.useMemo(() => {
    if (scrollbarHeight === 0 || contentHeight === 0) return 0;
    return Math.min(
      Math.max(40, scrollbarHeight * (viewportHeight / contentHeight)),
      100,
    );
  }, [scrollbarHeight, contentHeight, viewportHeight]);

  const state: ScrollAreaRootState = React.useMemo(
    () => ({
      corner: { height: scrollbarHeight, width: scrollbarWidth },
      focused,
      focusVisible,
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
      thumb: { height: thumbSizeY, width: thumbSizeX },
    }),
    [
      focused,
      focusVisible,
      hasOverflowX,
      hasOverflowY,
      isHovering,
      isScrolling,
      isVisible,
      overflowDistances,
      overflowXEnd,
      overflowXStart,
      overflowYEnd,
      overflowYStart,
      scrollbarHeight,
      scrollbarWidth,
      thumbSizeX,
      thumbSizeY,
    ],
  );

  const contextValue = {
    contentHeight,
    contentWidth,
    hasOverflowX,
    hasOverflowY,
    // Viewport reads these from context to become the focusable element
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
    tabIndex: tabIndex ?? 0,
    viewportHeight,
    viewportRef,
    viewportWidth,
  };

  return {
    contextValue,
    focusRingStyle,
    // Root attaches these so bubbled focus from Viewport triggers the overlay
    handleBlur: onBlur,
    handleFocus: onFocus,
    setIsHovering,
    state,
  };
}