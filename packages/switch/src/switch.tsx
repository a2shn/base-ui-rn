import { PressableWithKeyDown, mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { SwitchContext } from './context';
import type { SwitchRootProps } from './types';
import { useSwitchRoot } from './use-switch';

/**
 * The main container for the Switch component.
 *
 * Manages the checked state and handles user interactions (press, keyboard).
 * Provides context to the `Switch.Thumb` sub-component.
 *
 * @example
 * ```tsx
 * <Switch.Root>
 * <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchRoot = React.memo(
  React.forwardRef<View, SwitchRootProps>((props, ref) => {
    const {
      children,
      style,
      ...otherProps
    } = props;

    const {
      checked,
      isDisabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handlePress,
      handleAccessibilityAction,
      state,
      isFocusable,
      tabIndex,
      handleKeyDown
    } = useSwitchRoot(props);

    const internalRef = React.useRef<View>(null);

    const resolvedStyle = resolveValue(style, state)

    const mergedProps = mergeProps(
    {
      accessibilityState: {
        checked,
        disabled: isDisabled,
      },
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      ref: internalRef,
      style: [
        resolvedStyle,
        focusRingStyle,
        Platform.OS === 'web' && state.focused ? { zIndex: 1 } : undefined
      ],
    },
    { ref },
    otherProps,
    {
      accessible: true,
      role: "switch"
    }
  );

    return (
      <SwitchContext.Provider value={state}>
        <PressableWithKeyDown
          {...mergedProps}
          disabled={isDisabled}
          focusable={isFocusable}
          tabIndex={tabIndex}
        >
          {resolveValue(children, state)}
        </PressableWithKeyDown>
      </SwitchContext.Provider>
    );
  }),
);

SwitchRoot.displayName = 'Switch.Root';
