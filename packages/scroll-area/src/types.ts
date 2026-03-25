import type {
  ARIABaseProps,
  ARIATraitOrientation,
  FocusVisibleProps,
} from '@base-ui-rn/core';
import type * as React from 'react';
import type {
  ScrollViewProps,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

/**
 * The orientation of the scrollbar.
 */
export type ScrollAreaOrientation = 'horizontal' | 'vertical';

/**
 * Controls when the scrollbar is visible.
 */
export type ScrollAreaVisibility = 'auto' | 'always' | 'scroll' | 'hover';

/**
 * State for the ScrollArea root element.
 */
export interface ScrollAreaRootState {
  /**
   * Whether there is overflow in the horizontal direction.
   * @default false
   */
  hasOverflowX: boolean;
  /**
   * Whether there is overflow in the vertical direction.
   * @default false
   */
  hasOverflowY: boolean;
  /**
   * Whether the user is currently scrolling.
   * @default false
   */
  isScrolling: boolean;
  /**
   * Whether the user is hovering over the scroll area.
   * @default false
   */
  isHovering: boolean;
  /**
   * Whether the scrollbar is visible.
   * @default false
   */
  isVisible: boolean;
  /**
   * Whether the overflow is at the start in the horizontal direction.
   * @default false
   */
  overflowXStart: boolean;
  /**
   * Whether the overflow is at the end in the horizontal direction.
   * @default false
   */
  overflowXEnd: boolean;
  /**
   * Whether the overflow is at the start in the vertical direction.
   * @default false
   */
  overflowYStart: boolean;
  /**
   * Whether the overflow is at the end in the vertical direction.
   * @default false
   */
  overflowYEnd: boolean;
  /**
   * Whether the scroll area should show a focus ring.
   * @default false
   */
  focusVisible: boolean;
  /**
   * Whether the scroll area is focused.
   * @default false
   */
  focused: boolean;
  corner: {
    /**
     * The height of the corner element.
     * @default 0
     */
    height: number;
    /**
     * The width of the corner element.
     * @default 0
     */
    width: number;
  };
  thumb: {
    /**
     * The height of the thumb element.
     * @default 0
     */
    height: number;
    /**
     * The width of the thumb element.
     * @default 0
     */
    width: number;
  };
  overflow: {
    /**
     * The overflow at the start in the horizontal direction.
     * @default 0
     */
    xStart: number;
    /**
     * The overflow at the end in the horizontal direction.
     * @default 0
     */
    xEnd: number;
    /**
     * The overflow at the start in the vertical direction.
     * @default 0
     */
    yStart: number;
    /**
     * The overflow at the end in the vertical direction.
     * @default 0
     */
    yEnd: number;
  };
}

/**
 * State for the ScrollArea viewport element.
 */
export type ScrollAreaViewportState = ScrollAreaRootState;

/**
 * State for the ScrollArea scrollbar element.
 */
export interface ScrollAreaScrollbarState extends ScrollAreaRootState {
  /**
   * The orientation of the scrollbar.
   * @default 'vertical'
   */
  orientation: ScrollAreaOrientation;
}

/**
 * State for the ScrollArea thumb element.
 */
export interface ScrollAreaThumbState {
  /**
   * The orientation of the thumb.
   * @default 'vertical'
   */
  orientation: ScrollAreaOrientation;
  /**
   * Whether the thumb is being dragged.
   * @default false
   */
  isDragging: boolean;
}

/**
 * State for the ScrollArea corner element.
 */
export type ScrollAreaCornerState = ScrollAreaRootState;

/**
 * Web-specific accessibility and data attributes for ScrollArea Root.
 */
export interface WebScrollAreaRootProps extends ARIABaseProps {
  'data-has-overflow-x'?: boolean;
  'data-has-overflow-y'?: boolean;
  'data-overflow-x-end'?: boolean;
  'data-overflow-x-start'?: boolean;
  'data-overflow-y-end'?: boolean;
  'data-overflow-y-start'?: boolean;
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Viewport.
 */
export interface WebScrollAreaViewportProps extends ARIABaseProps {
  'data-has-overflow-x'?: boolean;
  'data-has-overflow-y'?: boolean;
  'data-overflow-x-end'?: boolean;
  'data-overflow-x-start'?: boolean;
  'data-overflow-y-end'?: boolean;
  'data-overflow-y-start'?: boolean;
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Scrollbar.
 */
export interface WebScrollAreaScrollbarProps extends ARIABaseProps {
  'data-orientation'?: ScrollAreaOrientation;
  'data-has-overflow-x'?: boolean;
  'data-has-overflow-y'?: boolean;
  'data-hovering'?: boolean;
  'data-overflow-x-end'?: boolean;
  'data-overflow-x-start'?: boolean;
  'data-overflow-y-end'?: boolean;
  'data-overflow-y-start'?: boolean;
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Thumb.
 */
export interface WebScrollAreaThumbProps extends ARIABaseProps {
  'data-orientation'?: ScrollAreaOrientation;
}

export interface ScrollAreaRootProps
  extends Omit<ViewProps, 'style'>, WebScrollAreaRootProps, FocusVisibleProps {
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
  /**
   * The number of pixels to scroll when using arrow keys on web.
   * @default 40
   */
  keyboardStep?: number;
  /**
   * The percentage of the viewport to scroll when using Page Up/Down keys on web.
   * Accepts a value between 0 and 1.
   * @default 0.9
   */
  keyboardPageStep?: number;
  children?: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaRootState) => StyleProp<ViewStyle>);
}

export interface ScrollAreaViewportProps
  extends
    Omit<ScrollViewProps, 'style' | 'children'>,
    WebScrollAreaViewportProps,
    FocusVisibleProps {
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

/**
 * Props for the ScrollArea content element.
 */
export interface ScrollAreaContentProps extends ViewProps {
  children?: React.ReactNode;
}

export interface ScrollAreaScrollbarProps
  extends
    Omit<ViewProps, 'style'>,
    WebScrollAreaScrollbarProps,
    ARIATraitOrientation {
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
  extends Omit<ViewProps, 'style'>, WebScrollAreaThumbProps {
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
