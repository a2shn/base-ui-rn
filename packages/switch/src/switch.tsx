import {
  evaluateStyles,
  mergeProps,
  PressableWithKeyDown,
  useStyle,
} from '@base-ui-rn/core';
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
      id,
      style,
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
    } = useSwitchRoot(props);

    const internalRef = React.useRef<View>(null);

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && state.focused ? { zIndex: 1 } : undefined,
      ],
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPress: handlePress,
      onAccessibilityAction: handleAccessibilityAction,
      disabled: isDisabled,
      focusable: isFocusable,
      ref: [internalRef, ref],
      style: resolvedStyle,
      accessibilityState: {
        checked,
        disabled: isDisabled,
      },
    });

    return (
      <SwitchContext.Provider value={state}>
        <PressableWithKeyDown
          accessible
          nativeID={id}
          role="switch"
          {...mergedProps}
          disabled={isDisabled}
          focusable={isFocusable}
          tabIndex={tabIndex}
        >
          {evaluateStyles(children, state)}
        </PressableWithKeyDown>
      </SwitchContext.Provider>
    );
  }),
);

SwitchRoot.displayName = 'Switch.Root';
