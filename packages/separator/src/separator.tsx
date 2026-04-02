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
    const { decorative = false, style } = props;

    const mergedProps = mergeProps(props, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style,
    });

    return (
      <View
        accessibilityElementsHidden={decorative}
        accessible={true}
        importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
        role={props.role ?? (decorative ? 'presentation' : 'separator')}
        {...mergedProps}
      />
    );
  },
);

Separator.displayName = 'Separator';
