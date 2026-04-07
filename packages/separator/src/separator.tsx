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
    const { decorative = false, style, role, ...otherProps } = props;

    const mergedProps = mergeProps(otherProps, {
      focusable: false,
      accessible: true,
      ref,
      style,
    });

    return (
      <View
        {...mergedProps}
        role={role ?? (decorative ? 'presentation' : 'separator')}
        accessibilityElementsHidden={decorative}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      />
    );
  },
);

Separator.displayName = 'Separator';
