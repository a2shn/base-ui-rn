import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useSwitchContext } from './context';
import type { SwitchThumbProps } from './types';

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
export const SwitchThumb = React.memo(
  React.forwardRef<View, SwitchThumbProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      style,
      ...otherProps
    } = props;

    const context = useSwitchContext();

    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-checked={context.checked ? 'true' : undefined}
        data-disabled={context.disabled ? 'true' : undefined}
        data-readonly={context.readOnly ? 'true' : undefined}
        data-unchecked={!context.checked ? 'true' : undefined}
        ref={ref}
        style={evaluateStyles(style, context)}
      >
        {evaluateStyles(children, context)}
      </View>
    );
  }),
);

SwitchThumb.displayName = 'Switch.Thumb';
