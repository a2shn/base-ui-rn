import * as React from 'react';
import type { View } from 'react-native';

import type { SliderState } from './types';

interface SliderContextValue {
  state: SliderState;
  setValueAtIndex: (index: number, next: number) => void;
  stepBy: (index: number, delta: number) => void;
  commitValue: () => void;
  locale?: Intl.LocalesArgument;
  format?: Intl.NumberFormatOptions;
  thumbAlignment?: 'center' | 'edge' | 'edge-client-only';
  largeStep: number;
  setTrackSize: (size: number) => void;
  setThumbSize: (size: number) => void;
  thumbRefs: React.RefObject<(View | null)[]>;
  thumbNodeHandles: React.RefObject<Array<number | undefined>>;
  setFocusedThumbIndex: (index: number | null) => void;
  focusedThumbIndex: number | null;
  focusThumb: (index: number) => void;
  setDragging: (dragging: boolean) => void;
}

export const SliderContext = React.createContext<SliderContextValue | null>(
  null,
);

export function useSliderContext() {
  const context = React.useContext(SliderContext);
  if (!context) {
    throw new Error('Slider components must be used within <Slider.Root>.');
  }
  return context;
}
