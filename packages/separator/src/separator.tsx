import * as React from 'react';
import { View } from 'react-native';
import type { SeparatorProps } from './types';

/**
 * Headless separator primitive for React Native.
 *
 * @param orientation
 * The orientation of the separator.
 *
 * @param decorative
 * Whether the separator is purely decorative.
 * If true, it will be hidden from assistive technologies.
 *
 * @default orientation 'horizontal'
 * @default decorative false
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 */
export const Separator = React.forwardRef<View, SeparatorProps>(
  (props, ref) => {
    const {
      orientation = 'horizontal',
      decorative = false,
      style,
      ...other
    } = props;

    return (
      <View
        {...other}
        ref={ref}
        style={style}
        role={decorative ? 'presentation' : 'separator'}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        aria-orientation={orientation}
        {...({
          'data-orientation': orientation,
        } as Record<string, unknown>)}
      />
    );
  },
);
