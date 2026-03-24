import { useFocus } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import type { NativeSyntheticEvent, TextInputProps } from 'react-native';

import type { InputProps, InputState } from './types';

/**
 * Manages the state and logic for the Input primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the component.
 */
export function useInput(props: InputProps) {
  const {
    defaultValue,
    dirty: controlledDirty,
    disabled = false,
    invalid = false,
    onBlur: onBlurProp,
    onChangeText,
    onFocus: onFocusProp,
    onValueChange,
    touched: controlledTouched,
    valid = false,
    value: controlledValue,
  } = props;

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const [internalDirty, setInternalDirty] = React.useState(false);
  const [internalTouched, setInternalTouched] = React.useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isDirty =
    controlledDirty !== undefined ? controlledDirty : internalDirty;
  const isTouched =
    controlledTouched !== undefined ? controlledTouched : internalTouched;

  const { focused, focusVisible, onBlur, onFocus } = useFocus({
    focusVisible: props.focusVisible,
  });

  const handleFocus = React.useCallback(
    (e: Parameters<NonNullable<TextInputProps['onFocus']>>[0]) => {
      onFocus();
      onFocusProp?.(e);
    },
    [onFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (e: Parameters<NonNullable<TextInputProps['onBlur']>>[0]) => {
      onBlur();
      setInternalTouched(true);
      onBlurProp?.(e);
    },
    [onBlur, onBlurProp],
  );

  const handleChangeText = React.useCallback(
    (text: string) => {
      if (controlledValue === undefined) {
        setInternalValue(text);
      }
      setInternalDirty(true);
      onChangeText?.(text);
      onValueChange?.(text, {
        nativeEvent: null as unknown as NativeSyntheticEvent<unknown>,
      });
    },
    [controlledValue, onChangeText, onValueChange],
  );

  const state: InputState = React.useMemo(
    () => ({
      dirty: isDirty,
      disabled,
      filled: value.length > 0,
      focused,
      focusVisible,
      invalid,
      touched: isTouched,
      valid,
    }),
    [
      isDirty,
      disabled,
      value,
      focused,
      focusVisible,
      invalid,
      isTouched,
      valid,
    ],
  );

  return {
    handleBlur,
    handleChangeText,
    handleFocus,
    state,
    value,
  };
}
