import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useScrollAreaContext } from './context';
import type { ScrollAreaCornerProps } from './types';

/**
 * Visual element rendered at the intersection of horizontal and vertical scrollbars.
 *
 * Only visible when both scrollbars are overflowing.
 *
 * @example
 * ```tsx
 * <ScrollArea.Corner />
 * ```
 */
export const Corner = React.memo(
  React.forwardRef<View, ScrollAreaCornerProps>((props, ref) => {
    const { style, ...otherProps } = props;
    const { state } = useScrollAreaContext();
    const isVisible = state.hasOverflowX && state.hasOverflowY;

    if (!isVisible) return null;

    const resolvedStyle = resolveValue(style, state);
    const internalProps = {
      style: [{ backgroundColor: 'transparent' }, resolvedStyle],
    };

    const mergedProps = mergeProps(internalProps, { ref }, otherProps, {
      focusable: false,
    });

    return <View {...mergedProps} />;
  }),
);

Corner.displayName = 'ScrollArea.Corner';
