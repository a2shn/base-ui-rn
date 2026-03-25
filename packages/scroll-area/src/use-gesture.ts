import * as React from 'react';
import { PanResponder, type ScrollView } from 'react-native';

interface UseGestureProps {
  orientation: 'horizontal' | 'vertical';
  contentWidth: number;
  contentHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  scrollbarWidth: number;
  scrollbarHeight: number;
  thumbSize: number;
  viewportRef: React.RefObject<ScrollView | null>;
  rawScrollX: React.RefObject<number>;
  rawScrollY: React.RefObject<number>;
  setIsScrolling: (isScrolling: boolean) => void;
}

export function useGesture(props: UseGestureProps) {
  const {
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
    viewportRef,
    viewportWidth,
  } = props;

  const [isDragging, setIsDragging] = React.useState(false);

  // Stable refs for gesture logic to avoid re-creating PanResponder too often
  const contentDimRef = React.useRef(0);
  const viewportDimRef = React.useRef(0);
  const scrollbarDimRef = React.useRef(0);
  const initialScrollRef = React.useRef(0);
  const isHorizontal = orientation === 'horizontal';

  React.useEffect(() => {
    if (isHorizontal) {
      contentDimRef.current = contentWidth;
      viewportDimRef.current = viewportWidth;
      scrollbarDimRef.current = scrollbarWidth;
    } else {
      contentDimRef.current = contentHeight;
      viewportDimRef.current = viewportHeight;
      scrollbarDimRef.current = scrollbarHeight;
    }
  }, [
    isHorizontal,
    contentWidth,
    contentHeight,
    viewportWidth,
    viewportHeight,
    scrollbarWidth,
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
          if (isHorizontal) {
            initialScrollRef.current = rawScrollX.current;
          } else {
            initialScrollRef.current = rawScrollY.current;
          }
        },
        onPanResponderMove: (_, gestureState) => {
          if (scrollbarDimRef.current === thumbSize) {
            return;
          }

          const scrollRange = contentDimRef.current - viewportDimRef.current;
          const scrollbarRange = scrollbarDimRef.current - thumbSize;

          if (scrollbarRange <= 0) {
            return;
          }

          // How much scroll changes per pixel of drag
          const ratio = scrollRange / scrollbarRange;
          const dragPos = isHorizontal ? gestureState.dx : gestureState.dy;

          const nextScroll = Math.max(
            0,
            Math.min(scrollRange, initialScrollRef.current + dragPos * ratio),
          );

          if (viewportRef.current) {
            viewportRef.current.scrollTo({
              animated: false,
              x: isHorizontal ? nextScroll : rawScrollX.current,
              y: isHorizontal ? rawScrollY.current : nextScroll,
            });
          }
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

  return {
    isDragging,
    panHandlers: panResponder.panHandlers,
  };
}
