import type { ViewProps } from 'react-native';
import type { WebAccessibilityProps } from '@base-ui-rn/core';

export type Orientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends ViewProps, WebAccessibilityProps {
  /**
   * The orientation of the separator.
   * @default 'horizontal'
   */
  orientation?: Orientation;
  /**
   * Whether the separator is purely decorative.
   * If true, it will be hidden from assistive technologies.
   * @default false
   */
  decorative?: boolean;
  /**
   * Web data attribute used for styling and testing.
   */
  'data-orientation'?: Orientation;
}
