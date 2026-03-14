import * as React from 'react';
import { View } from 'react-native';
import type { SwitchThumbProps } from './types';
import { useSwitchContext } from './context';

/**
 * The movable part of the switch that indicates whether it is on or off.
 *
 * It consumes the state from the `Switch.Root` and updates its data attributes
 * accordingly.
 *
 * @example
 * ```tsx
 * <Switch.Root>
 *   <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchThumb = React.forwardRef<View, SwitchThumbProps>(
  (props, ref) => {
    const {
      children,
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const context = useSwitchContext();

    const resolvedChildren =
      typeof children === 'function' ? children(context) : children;

    return (
      <View
        {...otherProps}
        ref={ref}
        style={style}
        aria-labelledby={ariaLabelledBy}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        data-checked={context.checked ? 'true' : undefined}
        data-disabled={context.disabled ? 'true' : undefined}
      >
        {resolvedChildren}
      </View>
    );
  },
);

SwitchThumb.displayName = 'SwitchThumb';
