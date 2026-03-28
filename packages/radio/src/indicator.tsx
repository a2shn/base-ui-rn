import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useRadioRootContext } from './radio-root-context';
import type { RadioIndicatorProps } from './types';

/**
 * Indicates whether the radio button is selected.
 *
 * Renders a View element that is conditionally mounted based on the Radio.Root
 * checked state. Its data attributes mirror the parent Radio.Root state.
 *
 * @example
 * ```tsx
 * <Radio.Root value="option-a">
 *   <Radio.Indicator />
 * </Radio.Root>
 * ```
 */
export const RadioIndicator = React.memo(
  React.forwardRef<View, RadioIndicatorProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      keepMounted = false,
      style,
      ...otherProps
    } = props;

    const context = useRadioRootContext();

    if (!keepMounted && !context.checked) {
      return null;
    }

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

RadioIndicator.displayName = 'Radio.Indicator';
