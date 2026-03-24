import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { TextInput } from 'react-native';

import type { InputProps } from './types';
import { useInput } from './use-input';

/**
 * Headless input primitive built on top of React Native TextInput.
 *
 * Provides a high-quality, unstyled input component that automatically
 * tracks focus, filled, dirty, and touched states.
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter your name"
 *   onValueChange={(value) => console.log(value)}
 * />
 * ```
 */
export const Input = React.memo(
  React.forwardRef<TextInput, InputProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      defaultValue,
      disableDefaultFocusRing = false,
      focusRingStyle,
      style,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      value: valueProp,
      ...otherProps
    } = props;

    const { handleBlur, handleChangeText, handleFocus, state, value } =
      useInput(props);

    return (
      <TextInput
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-dirty={state.dirty}
        data-disabled={state.disabled}
        data-filled={state.filled}
        data-focused={state.focused}
        data-invalid={state.invalid}
        data-touched={state.touched}
        data-valid={state.valid}
        editable={!state.disabled}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        ref={ref}
        style={evaluateStyles(style, state, {
          disableDefaultFocusRing,
          focusRingStyle,
        })}
        value={value}
      />
    );
  }),
);

Input.displayName = 'Input';
