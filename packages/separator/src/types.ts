import {
  type ARIABaseProps,
  type ARIAFocusProps,
  type ARIALiveProps,
  type ARIATraitDisabled,
  type ARIATraitExpanded,
  type ARIATraitOrientation,
} from '@base-ui-rn/core';
import type { ViewProps } from 'react-native';

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
