import {
  evaluateStyles,
  PressableWithKeyDown,
  mergeProps,
  mergeRefs,
  useStyle,
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
 * <Toggle onPressedChange={...}>
 * {({ pressed }) => <Text>{pressed ? 'On' : 'Off'}</Text>}
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Toggle(props, forwardedRef) {
    const { children, style, value, onPress, ...otherProps } = props;

    const {
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isFocusable,
      isInGroup,
      registerItem,
      registerValue,
      state,
      tabIndex,
    } = useToggle(props);

    const internalRef = React.useRef<View>(null);
    const mergedRef = mergeRefs(internalRef, forwardedRef);

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

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      handlers: {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onAccessibilityAction: handleAccessibilityAction,
      },
      disabled: state.disabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        checked: state.pressed,
        disabled: state.disabled,
      },
      accessibilityActions: !state.disabled ? [{ name: 'activate' }] : [],
    });

    return (
      <PressableWithKeyDown
        accessibilityHint="Toggles the state"
        accessibilityLiveRegion="polite"
        accessible={true}
        importantForAccessibility={isFocusable ? 'yes' : 'no-hide-descendants'}
        role={props.role ?? 'checkbox'}
        tabIndex={tabIndex}
        {...mergedProps}
      >
        {(pressableState: PressableStateCallbackType) =>
          evaluateStyles(children, {
            ...pressableState,
            ...state,
          })
        }
      </PressableWithKeyDown>
    );
  }),
);

Toggle.displayName = 'Toggle';
