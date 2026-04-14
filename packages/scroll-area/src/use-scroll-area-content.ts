import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { useScrollAreaContext } from './context';

export function useScrollAreaContent() {
  const { setContentHeight, setContentWidth } = useScrollAreaContext();

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { height, width } = event.nativeEvent.layout;
      setContentWidth(width);
      setContentHeight(height);
    },
    [setContentHeight, setContentWidth],
  );

  return { handleLayout };
}
