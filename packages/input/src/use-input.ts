import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';

import type { InputProps, InputState } from './types';

export function useInput(props: InputProps) {
  const {
    defaultValue,
    dirty: controlledDirty,
    disabled = false,
    readOnly = false,
    required = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    invalid = false,
    onBlur: onBlurProp,
    onChangeText,
    onFocus: onFocusProp,
    onValueChange,
    tabIndex: tabIndexProp,
    touched: controlledTouched,
    valid = false,
    value: controlledValue,
  } = props;

  const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
  const [internalDirty, setInternalDirty] = React.useState(false);
  const [internalTouched, setInternalTouched] = React.useState(false);

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isDirty = controlledDirty !== undefined ? controlledDirty : internalDirty;
  const isTouched = controlledTouched !== undefined ? controlledTouched : internalTouched;

  const { focused, focusRingStyle, isFocusable, onBlur, onFocus, focusVisible } =
    useFocusRing({
      disabled,
      disableDefaultFocusRing,
      focusableWhenDisabled,
    });

  const tabIndex = resolveTabIndex(
    isFocusable,
    tabIndexProp as 0 | -1 | undefined,
  );

  const handleFocus = React.useCallback(
    (e: any) => {
      onFocus();
      onFocusProp?.(e);
    },
    [onFocus, onFocusProp],
  );

  const handleBlur = React.useCallback(
    (e: any) => {
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
        nativeEvent: { text } as any,
      });
    },
    [controlledValue, onChangeText, onValueChange],
  );

  const state: InputState = React.useMemo(
    () => ({
      focusVisible,
      dirty: isDirty,
      disabled,
      readOnly,
      required,
      filled: value.length > 0,
      focused,
      invalid,
      touched: isTouched,
      valid,
    }),
    [focusVisible, isDirty, disabled, readOnly, required, value, focused, invalid, isTouched, valid],
  );

  return {
    focusRingStyle,
    handleBlur,
    handleChangeText,
    handleFocus,
    isFocusable,
    state,
    tabIndex,
    value
  };
}
