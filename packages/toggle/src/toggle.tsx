import {
  PressableWithKeyDown,
  mergeProps,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type PressableStateCallbackType, View } from 'react-native';

import { type ToggleProps } from './types';
import { useToggle } from './use-toggle';

/**
 * Headless toggle primitive built on top of React Native Pressable.
 *
 * Can be used as a standalone checkbox/switch or as a member of a `ToggleGroup`.
 * Supports keyboard interaction, focus management, and accessibility states.
 *
 * @example
 * ```tsx
 * <Toggle onPressedChange={console.log}>
 * {({ pressed }) => <Text>{pressed ? 'On' : 'Off'}</Text>}
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Toggle(props, ref) {
    const { children, style, role, value, ...otherProps } = props;

    const {
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isDisabled,
      isFocusable,
      isInGroup,
      registerItem,
      registerValue,
      state,
      tabIndex,
    } = useToggle(props);

    const internalRef = React.useRef<View>(null);

    React.useEffect(() => {
      if (isInGroup && value !== undefined) {
        const unregisterItem = registerItem?.(value, internalRef);
        const unregisterValue = registerValue?.(value);

        return () => {
          unregisterItem?.();
          unregisterValue?.();
        };
      }
      return undefined;
    }, [value, isInGroup, registerItem, registerValue]);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
    {
      accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
      accessibilityState: {
        checked: state.pressed,
        disabled: isDisabled,
      },
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      ref: internalRef,
      style: [resolvedStyle, focusRingStyle]
    },
    { ref },
    otherProps,
    {
      accessibilityHint: "Toggles the state",
      accessibilityLiveRegion: "polite",
      accessible: true,
      role: role ?? "checkbox"
    }
  );
    return (
      <PressableWithKeyDown
        {...mergedProps}
        disabled={isDisabled}
        focusable={isFocusable}
        tabIndex={tabIndex}
        importantForAccessibility={isFocusable ? 'yes' : 'no-hide-descendants'}
      >
        {(pressableState: PressableStateCallbackType) =>
          resolveValue(children, {
            ...pressableState,
            ...state,
          })
        }
      </PressableWithKeyDown>
    );
  }),
);

Toggle.displayName = 'Toggle';
