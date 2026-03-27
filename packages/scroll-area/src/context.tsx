import * as React from 'react';
import { Animated, type ScrollView } from 'react-native';

import type { ScrollAreaRootState } from './types';

export interface ScrollAreaContextValue {
  state: ScrollAreaRootState;
  scrollX: Animated.Value;
  scrollY: Animated.Value;
  viewportWidth: number;
  viewportHeight: number;
  contentWidth: number;
  contentHeight: number;
  scrollbarWidth: number;
  scrollbarHeight: number;
  viewportRef: React.RefObject<ScrollView | null>;
  rawScrollX: React.RefObject<number>;
  rawScrollY: React.RefObject<number>;
  keyboardStep: number;
  keyboardPageStep: number;
  onBlur: () => void;
  onFocus: () => void;
  isFocusable: boolean;
  tabIndex: number;
  setViewportWidth: (w: number) => void;
  setViewportHeight: (h: number) => void;
  setContentWidth: (w: number) => void;
  setContentHeight: (h: number) => void;
  setScrollbarWidth: (w: number) => void;
  setScrollbarHeight: (h: number) => void;
  setIsHovering: (h: boolean) => void;
  setIsScrolling: (s: boolean) => void;
}

export const ScrollAreaContext =
  React.createContext<ScrollAreaContextValue | null>(null);

export function useScrollAreaContext() {
  const context = React.useContext(ScrollAreaContext);
  if (!context) {
    throw new Error(
      'ScrollArea components must be used within a ScrollArea.Root',
    );
  }
  return context;
}
