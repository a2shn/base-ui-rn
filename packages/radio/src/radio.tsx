import { PressableWithKeyDown, mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type PressableStateCallbackType } from 'react-native';

import { useOptionalRadioGroupContext } from './radio-group-context';
import { RadioRootContext } from './radio-root-context';
import type { RadioRootProps } from './types';
import { useRadio } from './use-radio';

/**
 * Headless radio root primitive built on top of React Native Pressable.
 *
 * A single radio button that can be used standalone or within a RadioGroup.
 * Supports keyboard interaction, focus management, and accessibility states.
 *
 * @example
 * ```tsx
 * <Radio.Root value="option-a">
 *   <Radio.Indicator />
 * </Radio.Root>
 * ```
 */
export const RadioRoot = React.memo(
  React.forwardRef<View, RadioRootProps>((props, ref) => {
    const { children, style, value, ...otherProps } = props;

    const groupContext = useOptionalRadioGroupContext();
    const internalRef = React.useRef<View>(null);

    const {
      checked,
      isDisabled,
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isFocusable,
      state,
      tabIndex,
    } = useRadio(props, groupContext);

    React.useEffect(() => {
      if (groupContext && value && internalRef.current) {
        const unregister = groupContext.registerItem(value, internalRef);
        return unregister;
      }
      return undefined;
    }, [value, groupContext]);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
        accessibilityState: {
          checked: checked,
          disabled: isDisabled,
        },
        onAccessibilityAction: handleAccessibilityAction,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        ref: internalRef,
        style: [resolvedStyle, focusRingStyle],
      },
      { ref },
      otherProps,
      {
        accessibilityHint: 'Selects the radio option',
        accessible: true,
        role: "radio",
      }
    );

    return (
      <RadioRootContext.Provider value={state}>
        <PressableWithKeyDown
          {...mergedProps}
          disabled={isDisabled}
          focusable={isFocusable}
          importantForAccessibility={isFocusable ? 'yes' : 'no'}
          tabIndex={tabIndex}
        >
          {(pressableState: PressableStateCallbackType) =>
            resolveValue(children, { ...pressableState, ...state })
          }
        </PressableWithKeyDown>
      </RadioRootContext.Provider>
    );
  }),
);

RadioRoot.displayName = 'Radio.Root';
