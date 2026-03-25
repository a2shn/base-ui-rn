import type { ARIABaseProps, ARIATraitOrientation } from '@base-ui-rn/core';
import type * as React from 'react';
import type {
  ScrollViewProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

export type ScrollAreaOrientation = 'horizontal' | 'vertical';

export type ScrollAreaVisibility = 'auto' | 'always' | 'scroll' | 'hover';

export interface ScrollAreaRootState {
  hasOverflowX: boolean;
  hasOverflowY: boolean;
  isScrolling: boolean;
  isHovering: boolean;
  isVisible: boolean;
  overflowXStart: boolean;
  overflowXEnd: boolean;
  overflowYStart: boolean;
  overflowYEnd: boolean;
}

export type ScrollAreaViewportState = ScrollAreaRootState;

export interface ScrollAreaScrollbarState extends ScrollAreaRootState {
  orientation: ScrollAreaOrientation;
}

export interface ScrollAreaThumbState {
  orientation: ScrollAreaOrientation;
  isDragging: boolean;
}

export type ScrollAreaCornerState = Record<string, never>;

export interface ScrollAreaRootProps
  extends Omit<ViewProps, 'style'>, ARIABaseProps {
  /**
   * The visibility of the scrollbars.
   * - 'auto': Visible when scrolling and when hovering.
   * - 'always': Always visible if there is overflow.
   * - 'scroll': Visible when scrolling.
   * - 'hover': Visible when hovering.
   * @default 'auto'
   */
  scrollbarVisibility?: ScrollAreaVisibility;
  /**
   * The threshold in pixels that must be passed before the overflow edge attributes are applied.
   * Accepts a single number for all edges or an object to configure them individually.
   * @default 0
   */
  overflowEdgeThreshold?:
    | number
    | {
        xStart?: number;
        xEnd?: number;
        yStart?: number;
        yEnd?: number;
      };
  children?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaRootState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaViewportProps
  extends Omit<ScrollViewProps, 'style' | 'children'>, ARIABaseProps {
  children?: React.ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaViewportState) => StyleProp<ViewStyle>);
  /**
   * Whether the viewport should measure its layout and update the ScrollArea state.
   * Only the outermost viewport should measure in nested configurations.
   * @default true
   */
  measure?: boolean;
}

export interface ScrollAreaContentProps extends ViewProps {
  children?: React.ReactNode;
}

export interface ScrollAreaScrollbarProps
  extends Omit<ViewProps, 'style'>, ARIABaseProps, ARIATraitOrientation {
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
  children?: React.ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaScrollbarState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaThumbProps
  extends Omit<ViewProps, 'style'>, ARIABaseProps {
  children?: React.ReactNode;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaThumbState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaCornerProps
  extends Omit<ViewProps, 'style'>, ARIABaseProps {
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaCornerState) => StyleProp<ViewStyle>);
}
