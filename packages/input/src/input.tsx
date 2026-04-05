import { mergeProps, useStyle, evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { TextInput } from 'react-native';

import type { InputProps } from './types';
import { useInput } from './use-input';

/**

 * Headless input primitive built on top of React Native TextInput.
 *
 * Provides a high-quality, unstyled input component with enhanced 
 * accessibility state mapping.
 *
 * @example
 * ```tsx
 * <Input />
 * ```
 */
export const Input = React.memo(
  React.forwardRef<TextInput, InputProps>((props, ref) => {
    const {
      style,
      children,
      'aria-busy': ariaBusy,
      ...otherProps
    } = props;

    const {
      focusRingStyle,
      handleBlur,
      handleChange,
      handleFocus,
      isFocusable,
      isDisabled,
      state,
      tabIndex,
      value,
    } = useInput(props);

    const internalRef = React.useRef<TextInput>(null);

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onChange: handleChange,
      ref: [internalRef, ref],
      style: resolvedStyle,
      accessibilityState: {
        disabled: state.disabled,
        busy: ariaBusy,
      }
    });

    return (
      <TextInput
        accessible={isFocusable}
        editable={!state.disabled && !state.readOnly}
        tabIndex={tabIndex}
        value={value}
        submitBehavior='blurAndSubmit'
        {...mergedProps}
        disabled={isDisabled}
        focusable={isFocusable}
      >
        {evaluateStyles(children, state)}
      </TextInput>
    );
  }),
);

Input.displayName = 'Input';
