import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { RadioGroupContext } from './radio-group-context';
import type { RadioGroupProps } from './types';
import { useRadioGroup } from './use-radio-group';

/**
 * Provides a shared selection state to a series of Radio.Root buttons.
 *
 * Manages controlled/uncontrolled value state, disabled/readOnly propagation,
 * and keyboard navigation between child radios via arrow keys.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="a">
 *   <Radio.Root value="a"><Radio.Indicator /></Radio.Root>
 *   <Radio.Root value="b"><Radio.Indicator /></Radio.Root>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = React.memo(
  React.forwardRef<View, RadioGroupProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabledProp,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      disabled = false,
      style,
      ...otherProps
    } = props;

    const { handleKeyDown, onRadioKeyDown, onValueChange, registerItem, state } =
      useRadioGroup(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        onRadioKeyDown,
        onValueChange,
        registerItem,
      }),
      [state, onRadioKeyDown, onValueChange, registerItem],
    );

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(
      () => evaluateStyles(style, state),
      [style, state],
    );

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <View
          {...otherProps}
          accessible={false}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={ariaDisabledProp ?? disabled}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-disabled={disabled ? 'true' : undefined}
          onKeyDown={handleKeyDown as any}
          ref={ref}
          role={'radiogroup' as any}
          style={resolvedStyle}
        >
          {evaluateStyles(children, state)}
        </View>
      </RadioGroupContext.Provider>
    );
  }),
);

RadioGroup.displayName = 'RadioGroup';
