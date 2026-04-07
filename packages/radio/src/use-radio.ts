import { KeyDownEventData, isActivationAction } from '@base-ui-rn/core';
import { resolveTabIndex, useFocusRing } from '@base-ui-rn/focus-ring';
import * as React from 'react';
import {
  type NativeSyntheticEvent,
  Platform,
} from 'react-native';

import type {
  RadioGroupContextValue,
  RadioRootProps,
  RadioRootState,
} from './types';

export function useRadio(
  props: RadioRootProps,
  groupContext: RadioGroupContextValue | null,
) {
  const {
    disabled: disabledProp = false,
    disableDefaultFocusRing = false,
    focusableWhenDisabled = false,
    readOnly: readOnlyProp = false,
    tabIndex: tabIndexProp,
    value,
  } = props;

  const isDisabled = disabledProp || (groupContext?.disabled ?? false);
  const isReadOnly = readOnlyProp || (groupContext?.readOnly ?? false);
  const checked = groupContext ? groupContext.value === value : false;

  const isInGroup = groupContext !== null;
  const hasActiveItem = groupContext?.value !== undefined;

  const {
    focused,
    focusRingStyle,
    focusVisible,
    isFocusable,
    onBlur: handleFocusOut,
    onFocus: handleFocusIn,
  } = useFocusRing({
    disabled: isDisabled,
    disableDefaultFocusRing,
    focusableWhenDisabled,
  });

  const tabIndex = React.useMemo(() => {
    if (tabIndexProp !== undefined) {
      return tabIndexProp;
    }
    if (Platform.OS !== 'web') {
      return undefined;
    }
    if (isInGroup) {
      return resolveTabIndex(isFocusable, undefined, {
        hasActiveItem,
        isActive: checked,
      });
    }
    return isFocusable ? 0 : -1;
  }, [tabIndexProp, isInGroup, isFocusable, hasActiveItem, checked]);

  const select = React.useCallback(() => {
    if (isDisabled || isReadOnly) return;
    groupContext?.onValueChange(value);
  }, [isDisabled, isReadOnly, groupContext, value]);

  const handlePress = React.useCallback(() => {
    select();
  }, [select]);

  const handleKeyDown = React.useCallback(
    (event: NativeSyntheticEvent<KeyDownEventData>) => {
      if (isDisabled) return;

      const { key } = event.nativeEvent;
      if ((key === 'Enter' || key === ' ') && !isDisabled && !isReadOnly) {
        select();
      }

      if (groupContext && value) {
        groupContext.onRadioKeyDown(value, event);
      }
    },
    [isDisabled, isReadOnly, select, groupContext, value],
  );

  const handleAccessibilityAction = React.useCallback(
    (event: { nativeEvent?: { actionName?: string } }) => {
      const actionName = event.nativeEvent?.actionName;
      if (actionName && isActivationAction(actionName) && !isDisabled) {
        select();
      }
    },
    [isDisabled, select],
  );

  const handleFocus = React.useCallback(
    () => {
      handleFocusIn();
    },
    [handleFocusIn],
  );

  const handleBlur = React.useCallback(
    () => {
      handleFocusOut();
    },
    [handleFocusOut],
  );

  const state: RadioRootState = {
    checked,
    disabled: isDisabled,
    focused,
    focusVisible,
    readOnly: isReadOnly,
  };

  return {
    checked,
    isDisabled,
    focusRingStyle,
    handleAccessibilityAction,
    handleBlur,
    handleFocus,
    handleKeyDown,
    handlePress,
    isFocusable,
    readOnly: isReadOnly,
    state,
    tabIndex,
  };
}
