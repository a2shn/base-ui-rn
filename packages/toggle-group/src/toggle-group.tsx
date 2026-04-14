import { mergeProps, resolveValue } from '@base-ui-rn/core';
import {
  ToggleGroupActionContext,
  ToggleGroupValueContext,
} from '@base-ui-rn/toggle';
import * as React from 'react';
import { View } from 'react-native';

import { type ToggleGroupProps } from './types';
import { useToggleGroup } from './use-toggle-group';

/**
 * Headless toggle-group primitive built on top of React Native View.
 *
 * Manages the selection state for a group of Toggles. Supports single or
 * multiple selection, roving focus navigation, and appropriate ARIA roles
 * (radiogroup or group).
 *
 * @example
 * ```tsx
 * <ToggleGroup value={value} onValueChange={setValue} multiple>
 * <Toggle value="a"><Text>Option A</Text></Toggle>
 * <Toggle value="b"><Text>Option B</Text></Toggle>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = React.memo(
  React.forwardRef<View, ToggleGroupProps>((props, ref) => {
    const { children, role, style, ...otherProps } = props;

    const {
      isDisabled,
      loopFocus,
      multiple,
      onToggleKeyDown,
      registerItem,
      registerValue,
      state,
      toggleValue,
      valueSet,
    } = useToggleGroup(props);

    const valueContext = React.useMemo(
      () => ({
        value: state.value,
        valueSet,
      }),
      [state.value, valueSet],
    );

    const actionContext = React.useMemo(
      () => ({
        disabled: isDisabled,
        loopFocus,
        multiple,
        onToggleKeyDown,
        orientation: state.orientation,
        registerItem,
        registerValue,
        toggleValue,
      }),
      [
        isDisabled,
        loopFocus,
        multiple,
        state.orientation,
        onToggleKeyDown,
        registerItem,
        registerValue,
        toggleValue,
      ],
    );

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        accessibilityState: { disabled: state.disabled },
        style: resolvedStyle,
      },
      { ref },
      otherProps,
      {
        accessibilityLiveRegion: 'none',
        accessible: true,
        focusable: false,
        importantForAccessibility: 'yes',
        role: role ?? (multiple ? 'group' : 'radiogroup'),
      },
    );

    return (
      <ToggleGroupActionContext.Provider value={actionContext}>
        <ToggleGroupValueContext.Provider value={valueContext}>
          <View {...mergedProps}>{resolveValue(children, state)}</View>
        </ToggleGroupValueContext.Provider>
      </ToggleGroupActionContext.Provider>
    );
  }),
);

ToggleGroup.displayName = 'ToggleGroup';
