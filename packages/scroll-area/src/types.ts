import type { ARIABaseProps, ARIATraitOrientation } from '@base-ui-rn/core';
import type { FocusRingState } from '@base-ui-rn/focus-ring';
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
export interface ScrollAreaRootState extends FocusRingState {
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
   * Dimensions of the corner element.
   */
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
  /**
   * Dimensions of the thumb element.
   */
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
  /**
   * Precise scroll distances from the edges.
   */
  overflow: {
    /**
     * The overflow distance at the start in the horizontal direction.
     * @default 0
     */
    xStart: number;
    /**
     * The overflow distance at the end in the horizontal direction.
     * @default 0
     */
    xEnd: number;
    /**
     * The overflow distance at the start in the vertical direction.
     * @default 0
     */
    yStart: number;
    /**
     * The overflow distance at the end in the vertical direction.
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
  /**
   * Present when the scroll area content is wider than the viewport.
   */
  'data-has-overflow-x'?: boolean;
  /**
   * Present when the scroll area content is taller than the viewport.
   */
  'data-has-overflow-y'?: boolean;
  /**
   * Present when there is overflow on the horizontal end side.
   */
  'data-overflow-x-end'?: boolean;
  /**
   * Present when there is overflow on the horizontal start side.
   */
  'data-overflow-x-start'?: boolean;
  /**
   * Present when there is overflow on the vertical end side.
   */
  'data-overflow-y-end'?: boolean;
  /**
   * Present when there is overflow on the vertical start side.
   */
  'data-overflow-y-start'?: boolean;
  /**
   * Present when the user is currently scrolling.
   */
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Viewport.
 */
export interface WebScrollAreaViewportProps extends ARIABaseProps {
  /**
   * Present when the scroll area content is wider than the viewport.
   */
  'data-has-overflow-x'?: boolean;
  /**
   * Present when the scroll area content is taller than the viewport.
   */
  'data-has-overflow-y'?: boolean;
  /**
   * Present when there is overflow on the horizontal end side.
   */
  'data-overflow-x-end'?: boolean;
  /**
   * Present when there is overflow on the horizontal start side.
   */
  'data-overflow-x-start'?: boolean;
  /**
   * Present when there is overflow on the vertical end side.
   */
  'data-overflow-y-end'?: boolean;
  /**
   * Present when there is overflow on the vertical start side.
   */
  'data-overflow-y-start'?: boolean;
  /**
   * Present when the user is currently scrolling.
   */
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Scrollbar.
 */
export interface WebScrollAreaScrollbarProps extends ARIABaseProps {
  /**
   * Indicates the orientation of the scrollbar.
   */
  'data-orientation'?: ScrollAreaOrientation;
  /**
   * Present when the scroll area content is wider than the viewport.
   */
  'data-has-overflow-x'?: boolean;
  /**
   * Present when the scroll area content is taller than the viewport.
   */
  'data-has-overflow-y'?: boolean;
  /**
   * Present when the pointer is over the scroll area.
   */
  'data-hovering'?: boolean;
  /**
   * Present when there is overflow on the horizontal end side.
   */
  'data-overflow-x-end'?: boolean;
  /**
   * Present when there is overflow on the horizontal start side.
   */
  'data-overflow-x-start'?: boolean;
  /**
   * Present when there is overflow on the vertical end side.
   */
  'data-overflow-y-end'?: boolean;
  /**
   * Present when there is overflow on the vertical start side.
   */
  'data-overflow-y-start'?: boolean;
  /**
   * Present when the user is currently scrolling.
   */
  'data-scrolling'?: boolean;
}

/**
 * Web-specific accessibility and data attributes for ScrollArea Thumb.
 */
export interface WebScrollAreaThumbProps extends ARIABaseProps {
  /**
   * Indicates the orientation of the scrollbar.
   */
  'data-orientation'?: ScrollAreaOrientation;
}

/**
 * Props for the ScrollArea root element.
 */
export interface ScrollAreaRootProps
  extends Omit<ViewProps, 'style'>, WebScrollAreaRootProps {
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
  /**
   * The children of the component.
   */
  children?: React.ReactNode;
  /**
   * Event handler for key down events on web.
   */
  onKeyDown?: (event: React.KeyboardEvent) => void;
  /**
   * The style applied to the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaRootState) => StyleProp<ViewStyle>);
  /**
   * Whether the default focus ring should be disabled.
   * @default false
   */
  disableDefaultFocusRing?: boolean;
  /**
   * Custom style for the focus ring.
   */
  focusRingStyle?: StyleProp<ViewStyle>;
  /**
   * Whether to force the focus visible state.
   * @default false
   */
  focusVisible?: boolean;
  /**
   * Whether the element should remain focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

/**
 * Props for the ScrollArea viewport element.
 */
export interface ScrollAreaViewportProps
  extends
    Omit<ScrollViewProps, 'style' | 'children'>,
    WebScrollAreaViewportProps {
  /**
   * The children of the component.
   */
  children?: React.ReactNode;
  /**
   * The style applied to the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaViewportState) => StyleProp<ViewStyle>);
  /**
   * Whether the viewport should measure its layout and update the ScrollArea state.
   * Only the outermost viewport should measure in nested configurations.
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
  /**
   * Whether to force the focus visible state.
   * @default false
   */
  focusVisible?: boolean;
}

/**
 * Props for the ScrollArea content element.
 */
export interface ScrollAreaContentProps extends ViewProps {
  /**
   * The children of the component.
   */
  children?: React.ReactNode;
}

/**
 * Props for the ScrollArea scrollbar element.
 */
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
  /**
   * The children of the component.
   */
  children?: React.ReactNode;
  /**
   * The style applied to the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaScrollbarState) => StyleProp<ViewStyle>);
}

/**
 * Props for the ScrollArea thumb element.
 */
export interface ScrollAreaThumbProps
  extends Omit<ViewProps, 'style'>, WebScrollAreaThumbProps {
  /**
   * The children of the component.
   */
  children?: React.ReactNode;
  /**
   * The style applied to the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaThumbState) => StyleProp<ViewStyle>);
}

/**
 * Props for the ScrollArea corner element.
 */
export interface ScrollAreaCornerProps
  extends Omit<ViewProps, 'style'>, ARIABaseProps {
  /**
   * The style applied to the component.
   */
  style?:
    | StyleProp<ViewStyle>
    | ((state: ScrollAreaCornerState) => StyleProp<ViewStyle>);
}
