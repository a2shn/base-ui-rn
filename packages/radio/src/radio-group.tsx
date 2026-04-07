import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { RadioGroupContext } from './radio-group-context';
import type { RadioGroupProps } from './types';
import { useRadioGroup } from './use-radio-group';

/**
 * Headless radio group primitive built on top of React Native View.
 *
 * Groups a collection of Radio.Root buttons and manages their selection state.
 * Supports keyboard navigation and controlled/uncontrolled value.
 *
 * @example
 * ```tsx
 * <RadioGroup defaultValue="a">
 *   <Radio.Root value="a"><Radio.Indicator /></Radio.Root>
 *   <Radio.Root value="b"><Radio.Indicator /></Radio.Root>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = React.memo(
  React.forwardRef<View, RadioGroupProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      disabled,
      onRadioKeyDown,
      onValueChange,
      readOnly,
      registerItem,
      state,
    } = useRadioGroup(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        onRadioKeyDown,
        onValueChange,
        readOnly,
        registerItem,
      }),
      [state, onRadioKeyDown, onValueChange, readOnly, registerItem],
    );

    const resolvedStyle = resolveValue(style, state)
    const mergedProps = mergeProps(otherProps, {
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        disabled,
      },
      role: "group"
    });

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <View {...mergedProps}>
          {resolveValue(children, state)}
        </View>
      </RadioGroupContext.Provider>
    );
  }),
);

RadioGroup.displayName = 'RadioGroup';
