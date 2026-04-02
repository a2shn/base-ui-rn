import { mergeProps, mergeRefs, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { TextInput } from 'react-native';

import type { InputProps } from './types';
import { useInput } from './use-input';

/**
 * Headless input primitive built on top of React Native TextInput.
 *
 * Provides a high-quality, unstyled input component with enhanced 
 * accessibility state mapping.
 */
export const Input = React.memo(
  React.forwardRef<TextInput, InputProps>((props, forwardedRef) => {
    const {
      style,
      'aria-busy': ariaBusy,
      'aria-errormessage': ariaErrorMessage,
      'aria-describedby': ariaDescribedBy
    } = props;

    const {
      focusRingStyle,
      handleBlur,
      handleChangeText,
      handleFocus,
      isFocusable,
      state,
      tabIndex,
      value,
    } = useInput(props);

    const internalRef = React.useRef<TextInput>(null);
    const mergedRef = mergeRefs(internalRef, forwardedRef);

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      handlers: {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onChangeText: handleChangeText,
      },
      disabled: state.disabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        disabled: state.disabled,
        busy: ariaBusy,
        invalid: state.invalid,
      },
    });

    return (
      <TextInput
        accessible={isFocusable}
        aria-invalid={state.invalid}
        aria-errormessage={ariaErrorMessage}
        aria-describedby={ariaDescribedBy}
        editable={!state.disabled && !state.readOnly}
        tabIndex={tabIndex}
        value={value}
        {...mergedProps}
      />
    );
  }),
);

Input.displayName = 'Input';
