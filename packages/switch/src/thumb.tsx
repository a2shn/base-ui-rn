import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const context = useSwitchContext();

    return (
      <View
        {...otherProps}
        ref={ref}
        style={evaluateStyles(style, context)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        data-checked={context.checked ? 'true' : undefined}
        data-disabled={context.disabled ? 'true' : undefined}
      >
        {evaluateStyles(children, context)}
      </View>
    );
  },
);

SwitchThumb.displayName = 'SwitchThumb';
