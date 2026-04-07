import {
  PressableWithKeyDown,
  mergeProps,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { TabProps } from './types';
import { useTab } from './use-tab';

/**
 * An individual interactive tab button that toggles the corresponding panel.
 *
 * Supports keyboard activation, focus states, and ARIA attributes for web.
 *
 * @example
 * ```tsx
 * <Tabs.Tab value="tab-1">
 * {({ active }) => <Text style={{ color: active ? 'blue' : 'black' }}>Tab 1</Text>}
 * </Tabs.Tab>
 * ```
 */
export const Tab = React.memo(
  React.forwardRef<View, TabProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      isDisabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handleAccessibilityAction,
      isFocusable,
      handleOnLayout,
      ref: internalRef,
      state,
      tabIndex,
    } = useTab(props);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      otherProps,
      { ref },
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onAccessibilityAction: handleAccessibilityAction,
        onLayout: handleOnLayout,
        ref: internalRef,
        style: [
          resolvedStyle,
          focusRingStyle,
          Platform.OS === 'web' && (state.active || state.focused)
            ? { zIndex: 1 }
            : undefined,
        ],
        accessibilityState: {
          disabled: isDisabled,
          selected: state.active,
        },
        accessible: true,
        role: 'tab',
      },
    );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        tabIndex={tabIndex}
        disabled={isDisabled}
        focusable={isFocusable}
      >
        {resolveValue(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
