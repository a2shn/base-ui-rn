import { mergeProps, resolveValue } from '@base-ui-rn/core';
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
 * <Input placeholder="Enter text..." />
 * ```
 */
export const Input = React.memo(
  React.forwardRef<TextInput, InputProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      focusRingStyle,
      handleBlur,
      handleChangeText,
      handleFocus,
      isDisabled,
      isFocusable,
      state,
      tabIndex,
      value,
    } = useInput(props);

    const internalRef = React.useRef<TextInput>(null);

    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    {
      accessibilityState: { disabled: isDisabled },
      onBlur: handleBlur,
      onChangeText: handleChangeText,
      onFocus: handleFocus,
      ref: internalRef,
      style: [resolvedStyle, focusRingStyle]
    },
    { ref },
    otherProps,
    {
      accessible: true,
      submitBehavior: "blurAndSubmit"
    }
  );

    return (
      <TextInput
        {...mergedProps}
        focusable={isFocusable}
        editable={!isDisabled && !state.readOnly}
        tabIndex={tabIndex}
        value={value}
      >
        {resolveValue(children, state)}
      </TextInput>
    );
  }),
);

Input.displayName = 'Input';
