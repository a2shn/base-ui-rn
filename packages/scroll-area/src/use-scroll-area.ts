import * as React from 'react';
import { Animated, type ScrollView } from 'react-native';

import type { ScrollAreaRootProps, ScrollAreaRootState } from './types';

export type UseScrollAreaProps = ScrollAreaRootProps;

export function useScrollArea(props: UseScrollAreaProps) {
  const { overflowEdgeThreshold = 0, scrollbarVisibility = 'auto' } = props;

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

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const viewportRef = React.useRef<ScrollView>(null);

  const rawScrollX = React.useRef(0);
  const rawScrollY = React.useRef(0);

  React.useEffect(() => {
    const idX = scrollX.addListener(({ value }) => {
      rawScrollX.current = value;
    });
    const idY = scrollY.addListener(({ value }) => {
      rawScrollY.current = value;
    });
    return () => {
      scrollX.removeListener(idX);
      scrollY.removeListener(idY);
      if (scrollingTimeoutRef.current) {
        clearTimeout(scrollingTimeoutRef.current);
      }
    };
  }, [scrollX, scrollY]);

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

  const state: ScrollAreaRootState = React.useMemo(
    () => ({
      hasOverflowX,
      hasOverflowY,
      isHovering,
      isScrolling,
      isVisible,
      overflowXEnd,
      overflowXStart,
      overflowYEnd,
      overflowYStart,
    }),
    [
      hasOverflowX,
      hasOverflowY,
      isScrolling,
      isHovering,
      isVisible,
      overflowXStart,
      overflowXEnd,
      overflowYStart,
      overflowYEnd,
    ],
  );

  return {
    contentHeight,
    contentWidth,
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
    viewportHeight,
    viewportRef,
    viewportWidth,
  };
}
