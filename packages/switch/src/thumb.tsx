import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, style } = props;
    const state = useSwitchContext();

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <View {...mergedProps}>
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

SwitchThumb.displayName = 'Switch.Thumb';
