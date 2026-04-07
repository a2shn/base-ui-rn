import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, style, ...otherProps } = props;

    const {
      focusRingStyle,
      handleBlur,
      handleChange,
      handleFocus,
      isDisabled,
      isFocusable,
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

    const mergedProps = mergeProps(otherProps, { ref }, {
      accessibilityState: {
        disabled: isDisabled
      },
      onBlur: handleBlur,
      onChange: handleChange,
      onFocus: handleFocus,
      ref: internalRef,
      style: resolvedStyle,
      submitBehavior: 'blurAndSubmit',
      accessible: true
    });

    return (
      <TextInput
        {...mergedProps}
        focusable={isFocusable}
        editable={!isDisabled && !state.readOnly}
        tabIndex={tabIndex}
        value={value}
      >
        {evaluateStyles(children, state)}
      </TextInput>
    );
  }),
);

Input.displayName = 'Input';
