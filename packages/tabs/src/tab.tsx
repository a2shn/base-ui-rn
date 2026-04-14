import {
  mergeProps,
  PressableWithKeyDown,
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
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handleOnLayout,
      handlePress,
      isDisabled,
      isFocusable,
      ref: internalRef,
      state,
      tabIndex,
    } = useTab(props);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        accessibilityState: {
          disabled: isDisabled,
          selected: state.active,
        },
        onAccessibilityAction: handleAccessibilityAction,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onLayout: handleOnLayout,
        onPress: handlePress,
        ref: internalRef,
        style: [
          resolvedStyle,
          focusRingStyle,
          Platform.OS === 'web' && (state.active || state.focused)
            ? { zIndex: 1 }
            : undefined,
        ],
      },
      { ref },
      otherProps,
      {
        accessible: true,
        role: 'tab',
      },
    );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        disabled={isDisabled}
        focusable={isFocusable}
        tabIndex={tabIndex}
      >
        {resolveValue(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
