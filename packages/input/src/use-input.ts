import { useControllableState } from "@base-ui-rn/core";
import { resolveTabIndex, useFocusRing } from "@base-ui-rn/focus-ring";
import React from "react";
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { InputProps, InputState } from "./types";

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
    tabIndex: tabIndexProp,
    touched: controlledTouched,
    valid = false,
    value: controlledValue,
    onValueChange, onDirtyChange,
    onTouchedChange,
  } = props;

  const [value = '', setValue] = useControllableState<string>({
    prop: controlledValue,
    defaultProp: defaultValue ?? '',
  });

  const [dirty = false, setDirty] = useControllableState<boolean>({
    prop: controlledDirty,
    defaultProp: false,
    onChange: onDirtyChange,
  });

  const [touched = false, setTouched] = useControllableState<boolean>({
    prop: controlledTouched,
    defaultProp: false,
    onChange: onTouchedChange,
  });

  const isDisabled = disabled === true;

  const { focused, focusRingStyle, isFocusable, onBlur, onFocus, focusVisible } =
    useFocusRing({
      disabled: isDisabled,
      disableDefaultFocusRing,
      focusableWhenDisabled,
    });

  const tabIndex = resolveTabIndex(isFocusable, tabIndexProp);

  const handleBlur = React.useCallback(() => {
    onBlur();
    setTouched(true);
  }, [onBlur, setTouched]);

  const handleChange = React.useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      if (readOnly || isDisabled) return;

      const nextValue = e.nativeEvent.text;

      setValue(nextValue);
      setDirty(true);

      onValueChange?.(nextValue, { nativeEvent: e });
    },
    [readOnly, isDisabled, setValue, setDirty, onValueChange],
  );

  const state: InputState = React.useMemo(
    () => ({
      focusVisible,
      dirty,
      disabled: isDisabled,
      readOnly,
      required,
      filled: value.length > 0,
      focused,
      invalid,
      touched,
      valid,
    }),
    [focusVisible, dirty, isDisabled, readOnly, required, value, focused, invalid, touched, valid],
  );

  return {
    focusRingStyle,
    handleBlur,
    handleChange,
    handleFocus: onFocus,
    isFocusable,
    state,
    tabIndex,
    value,
    isDisabled,
  };
}
