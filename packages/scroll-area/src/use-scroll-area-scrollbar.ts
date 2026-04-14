import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { useScrollAreaContext } from './context';
import type {
  ScrollAreaScrollbarProps,
  ScrollAreaScrollbarState,
} from './types';

export function useScrollAreaScrollbar(props: ScrollAreaScrollbarProps) {
  const { keepMounted = false, orientation = 'vertical' } = props;
  const { setScrollbarHeight, setScrollbarWidth, state } =
    useScrollAreaContext();

  const scrollbarState: ScrollAreaScrollbarState = React.useMemo(
    () => ({ ...state, orientation }),
    [state, orientation],
  );

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      if (orientation === 'horizontal') setScrollbarWidth(width);
      else setScrollbarHeight(height);
    },
    [orientation, setScrollbarHeight, setScrollbarWidth],
  );

  const hasOverflow =
    orientation === 'horizontal' ? state.hasOverflowX : state.hasOverflowY;
  const isVisible = keepMounted || (hasOverflow && state.isVisible);

  return { handleLayout, isVisible, orientation, scrollbarState };
}
