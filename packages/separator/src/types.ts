import type { ViewProps } from 'react-native';

export type Orientation = 'horizontal' | 'vertical';

export interface SeparatorProps extends ViewProps {
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
