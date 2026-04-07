import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useSwitchContext } from './context';
import type { SwitchThumbProps } from './types';

/**
 * The movable part of the switch that indicates whether it is on or off.
 *
 * It consumes the state from the `Switch.Root` and can be styled dynamically based on it.
 *
 * @example
 * ```tsx
 * <Switch.Root>
 * <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchThumb = React.memo(
  React.forwardRef<View, SwitchThumbProps>((props, ref) => {
    const { children, style, ...otherProps } = props;
    const state = useSwitchContext();

    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    { style: resolvedStyle },
    { ref },
    otherProps,
    { focusable: false }
  );

    return (
      <View {...mergedProps}>
        {resolveValue(children, state)}
      </View>
    );
  }),
);

SwitchThumb.displayName = 'Switch.Thumb';
