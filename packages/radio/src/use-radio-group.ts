import { useKeyboardNavigation } from '@base-ui-rn/core';
import type { KeyPressEventData } from '@base-ui-rn/core';
import * as React from 'react';
import type { NativeSyntheticEvent } from 'react-native';

import type { RadioGroupProps, RadioGroupState, RadioValue } from './types';

/**
 * Manages the state and logic for the RadioGroup primitive.
 * @param props The initialization properties.
 * @returns State and event handlers for the group component.
 */
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

  const isControlled = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    RadioValue | undefined
  >(defaultValue);

  const value = isControlled ? controlledValue : uncontrolledValue;

  const { handleKeyDown, registerItem } = useKeyboardNavigation({
    loop: loopFocus,
    orientation,
  });

  const onValueChange = React.useCallback(
    (nextValue: RadioValue) => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChangeProp?.(nextValue);
    },
    [disabled, readOnly, isControlled, onValueChangeProp],
  );

  const onRadioKeyDown = React.useCallback(
    (
      currentValue: RadioValue,
      event: NativeSyntheticEvent<KeyPressEventData>,
    ) => {
      if (disabled) return;
      handleKeyDown(currentValue, event);
    },
    [disabled, handleKeyDown],
  );

  const state: RadioGroupState = React.useMemo(
    () => ({
      disabled,
      readOnly,
      value,
    }),
    [disabled, readOnly, value],
  );

  return {
    onRadioKeyDown,
    onValueChange,
    registerItem,
    state,
    value,
  };
}
