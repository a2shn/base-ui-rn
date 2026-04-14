import {
  KeyDownEventData,
  useControllableState,
  useKeyboardNavigation,
} from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import type { RadioGroupProps, RadioGroupState, RadioValue } from './types';

export function useRadioGroup(props: RadioGroupProps) {
  const {
    defaultValue,
    disabled = false,
    loopFocus = true,
    onValueChange: onValueChangeProp,
    orientation = 'vertical',
    readOnly = false,
    value: controlledValue,
  } = props;

  const [value, setValue] = useControllableState<RadioValue | undefined>({
    defaultProp: defaultValue,
    onChange: onValueChangeProp
      ? (val: RadioValue | undefined) => onValueChangeProp(val as RadioValue)
      : undefined,
    prop: controlledValue,
  });

  const { handleKeyDown, registerItem } = useKeyboardNavigation({
    loop: loopFocus,
    orientation,
  });

  const onValueChange = React.useCallback(
    (nextValue: RadioValue) => {
      if (disabled || readOnly) return;
      setValue(nextValue);
    },
    [disabled, readOnly, setValue],
  );

  const onRadioKeyDown = React.useCallback(
    (
      currentValue: RadioValue,
      event: NativeSyntheticEvent<KeyDownEventData>,
    ) => {
      if (disabled) return;
      handleKeyDown(currentValue, event);
    },
    [disabled, handleKeyDown],
  );

  const state: RadioGroupState = React.useMemo(
    () => ({
      disabled,
      value,
    }),
    [disabled, value],
  );

  return {
    disabled,
    onRadioKeyDown,
    onValueChange,
    readOnly,
    registerItem,
    state,
    value,
  };
}
