import { useControllableState } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import React from 'react';

import { InputChangeEventDetails, InputProps, InputState } from './types';

export function useInput(props: InputProps) {
  const {
    defaultValue,
    dirty: controlledDirty,
    disabled = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    invalid = false,
    onDirtyChange,
    onTouchedChange,
    onValueChange,
    readOnly = false,
    required = false,
    tabIndex: tabIndexProp,
    touched: controlledTouched,
    valid = false,
    value: controlledValue,
  } = props;

  const [value = '', setValue] = useControllableState<string>({
    defaultProp: defaultValue ?? '',
    prop: controlledValue,
  });

  const [dirty = false, setDirty] = useControllableState<boolean>({
    defaultProp: false,
    onChange: onDirtyChange,
    prop: controlledDirty,
  });

  const [touched = false, setTouched] = useControllableState<boolean>({
    defaultProp: false,
    onChange: onTouchedChange,
    prop: controlledTouched,
  });

  const isDisabled = disabled === true;

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur,
    onFocus,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const handleBlur = React.useCallback(() => {
    onBlur();
    setTouched(true);
  }, [onBlur, setTouched]);

  const handleChangeText = React.useCallback(
    (text: string) => {
      if (readOnly || isDisabled) return;

      const nextValue = text;

      setValue(nextValue);
      setDirty(true);

      onValueChange?.(nextValue, {
        nativeEvent: { text },
      } as unknown as InputChangeEventDetails);
    },
    [readOnly, isDisabled, setValue, setDirty, onValueChange],
  );

  const state: InputState = React.useMemo(
    () => ({
      dirty,
      disabled: isDisabled,
      filled: value.length > 0,
      focused,
      focusVisible,
      invalid,
      readOnly,
      required,
      touched,
      valid,
    }),
    [
      focusVisible,
      dirty,
      isDisabled,
      readOnly,
      required,
      value,
      focused,
      invalid,
      touched,
      valid,
    ],
  );

  return {
    focusRingStyle,
    handleBlur,
    handleChangeText,
    handleFocus: onFocus,
    isDisabled,
    isFocusable,
    state,
    tabIndex,
    value,
  };
}
