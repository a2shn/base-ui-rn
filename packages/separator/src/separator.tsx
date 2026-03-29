import * as React from 'react';
import { View } from 'react-native';

import type { SeparatorProps } from './types';

/**
 * Headless separator primitive for React Native.
 *
 * Visually or semantically separates content. Supports horizontal and vertical
 * orientations and decorative mode.
 *
 * @example
 * ```tsx
 * <Separator orientation="horizontal" />
 * ```
 */
export const Separator = React.forwardRef<View, SeparatorProps>(
  (props, ref) => {
    const { decorative = false, orientation = 'horizontal', ...rest } = props;

    if (decorative) {
      return (
        <View
          {...rest}
          accessibilityElementsHidden
          accessibilityLiveRegion='none'
          accessibilityState={{
            disabled: false,
          }}
          importantForAccessibility='no-hide-descendants'
          ref={ref}
          role='presentation'
        />
      );
    }

    return (
      <View
        {...rest}
        accessibilityLabel={
          orientation === 'vertical'
            ? 'Vertical separator'
            : 'Horizontal separator'
        }
        accessibilityLiveRegion='none'
        accessibilityState={{
          disabled: false,
        }}
        accessible
        importantForAccessibility='yes'
        ref={ref}
        role='separator'
      />
    );
  },
);

Separator.displayName = 'Separator';
