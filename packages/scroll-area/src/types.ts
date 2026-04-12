import type { FocusRingState } from '@base-ui-rn/focus-ring';
import type * as React from 'react';
import type { ScrollViewProps, StyleProp, ViewProps, ViewStyle } from 'react-native';

export type ScrollAreaOrientation = 'horizontal' | 'vertical';

export type ScrollAreaVisibility = 'auto' | 'always' | 'scroll' | 'hover';

export interface ScrollAreaRootState extends FocusRingState {
  hasOverflowX: boolean;
  hasOverflowY: boolean;
  isScrolling: boolean;
  isHovering: boolean;
  isVisible: boolean;
  overflowXStart: boolean;
  overflowXEnd: boolean;
  overflowYStart: boolean;
  overflowYEnd: boolean;
  corner: {
    height: number;
    width: number;
  };
  thumb: {
    height: number;
    width: number;
  };
  overflow: {
    xStart: number;
    xEnd: number;
    yStart: number;
    yEnd: number;
  };
}

export type ScrollAreaViewportState = ScrollAreaRootState;

export interface ScrollAreaScrollbarState extends ScrollAreaRootState {
  orientation: ScrollAreaOrientation;
}

export interface ScrollAreaThumbState {
  orientation: ScrollAreaOrientation;
  isDragging: boolean;
}

export type ScrollAreaCornerState = ScrollAreaRootState;

export interface ScrollAreaRootProps extends Omit<ViewProps, 'style'> {
  /**
   * The visibility of the scrollbars.
   * @default 'auto'
   */
  scrollbarVisibility?: ScrollAreaVisibility;
  /**
   * The threshold in pixels that must be passed before the overflow edge attributes are applied.
   * @default 0
   */
  overflowEdgeThreshold?: number | { xStart?: number; xEnd?: number; yStart?: number; yEnd?: number; };
  /**
   * The number of pixels to scroll when using arrow keys on web.
   * @default 40
   */
  keyboardStep?: number;
  /**
   * The percentage of the viewport to scroll when using Page Up/Down keys on web.
   * @default 0.9
   */
  keyboardPageStep?: number;
  /**
   * Event handler for key down events on web.
   */
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /**
   * The style applied to the component.
   */
  style?: StyleProp<ViewStyle> | ((state: ScrollAreaRootState) => StyleProp<ViewStyle>);
  /**
   * Whether the default focus ring should be disabled.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Whether the element should remain focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

export interface ScrollAreaViewportProps extends Omit<ScrollViewProps, 'style'> {
  /**
   * The style applied to the component.
   */
  style?: StyleProp<ViewStyle> | ((state: ScrollAreaViewportState) => StyleProp<ViewStyle>);
  /**
   * Whether the viewport should measure its layout and update the ScrollArea state.
   * @default true
   */
  measure?: boolean;
  /**
   * Whether the default focus ring should be disabled.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Custom style for the focus ring.
   */
  focusRingStyle?: StyleProp<ViewStyle>;
}

export interface ScrollAreaContentProps extends ViewProps {}

export interface ScrollAreaScrollbarProps extends Omit<ViewProps, 'style'> {
  /**
   * Whether the scrollbar controls vertical or horizontal scroll.
   * @default 'vertical'
   */
  orientation?: ScrollAreaOrientation;
  /**
   * Whether to keep the HTML element in the DOM when the viewport isn't scrollable.
   * @default false
   */
  keepMounted?: boolean;
  /**
   * The style applied to the component.
   */
  style?: StyleProp<ViewStyle> | ((state: ScrollAreaScrollbarState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaThumbProps extends Omit<ViewProps, 'style'> {
  /**
   * The style applied to the component.
   */
  style?: StyleProp<ViewStyle> | ((state: ScrollAreaThumbState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaCornerProps extends Omit<ViewProps, 'style'> {
  /**
   * The style applied to the component.
   */
  style?: StyleProp<ViewStyle> | ((state: ScrollAreaCornerState) => StyleProp<ViewStyle>);
}
