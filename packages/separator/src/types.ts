import {
  type ARIABaseProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitOrientation,
} from '@base-ui-rn/core';
import type { ViewProps } from 'react-native';

/**
 * Web-specific accessibility props for Separator.
 */
export type WebSeparatorAccessibilityProps = ARIABaseProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation & {
    /**
     * Indicates the orientation of the separator.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
    /**
     * Defines a keyboard shortcut that activates or focuses the element.
     */
    'aria-keyshortcuts'?: string;
  };

export type Orientation = 'horizontal' | 'vertical';

export interface SeparatorProps
  extends ViewProps, WebSeparatorAccessibilityProps {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * Whether the separator is purely decorative.
   * @default false
   */
  decorative?: boolean;
}
