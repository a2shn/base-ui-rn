import { mergeProps } from '@base-ui-rn/core';
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
    const { decorative = false, role, style, ...otherProps } = props;

    const mergedProps = mergeProps({ style }, { ref }, otherProps, {
      accessible: true,
      focusable: false,
    });

    return (
      <View
        {...mergedProps}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        role={role ?? (decorative ? 'presentation' : 'separator')}
      />
    );
  },
);

Separator.displayName = 'Separator';
