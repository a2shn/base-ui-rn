import * as React from 'react';

export interface FocusRingRenderProps {
  /**
   * Whether the component is currently focused.
   */
  focused: boolean;
  /**
   * Whether the focus ring should be visible.
   * Usually true when focused via keyboard or non-touch navigation.
   */
  focusVisible: boolean;
}

export interface FocusRingProps {
  /**
   * The child element or a render function.
   * If a render function is provided, it receives the focus state.
   */
  children:
    | React.ReactNode
    | ((props: FocusRingRenderProps) => React.ReactNode);
  /**
   * Whether the focus ring should be visible even during touch interactions.
   * @default false
   */
  focusVisible?: boolean;
}
