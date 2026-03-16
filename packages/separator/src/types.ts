import type { ViewProps } from 'react-native';
import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitOrientation,
  type ARIATraitExpanded,
} from '@base-ui-rn/core';

/**
 * Web-specific accessibility props for Separator.
 */
export type WebSeparatorAccessibilityProps = ARIABaseProps &
  ARIAFocusProps &
  ARIALiveProps &
  ARIATraitDisabled &
  ARIATraitOrientation &
  ARIATraitExpanded & {
    /**
     * Indicates the orientation of the separator.
     */
    'data-orientation'?: 'horizontal' | 'vertical';
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
