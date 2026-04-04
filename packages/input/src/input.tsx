import { mergeProps, mergeRefs, useStyle, evaluateStyles } from '@base-ui-rn/core';
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
  React.forwardRef<TextInput, InputProps>((props, forwardedRef) => {
    const {
      style,
      children,
      'aria-busy': ariaBusy,
      ...otherProps
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

    const mergedProps = mergeProps(otherProps, {
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
      }
    });

    return (
      <TextInput
        accessible={isFocusable}
        editable={!state.disabled && !state.readOnly}
        tabIndex={tabIndex}
        value={value}
        // Native "click outside" behavior usually requires parent dismissal,
        // but we ensure the component is set up for standard native blur events.
        submitBehavior='blurAndSubmit'
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </TextInput>
    );
  }),
);

Input.displayName = 'Input';
