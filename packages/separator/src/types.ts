import type { ViewProps } from 'react-native';
import type { WebSeparatorAccessibilityProps } from '@base-ui-rn/core';

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
   * If true, it will be hidden from assistive technologies.
   * @default false
   */
  decorative?: boolean;
}
