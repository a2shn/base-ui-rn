import {
  evaluateStyles,
  mergeProps,
  mergeRefs,
  PressableWithKeyDown,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { TabProps } from './types';
import { useTab } from './use-tabs';

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
  React.forwardRef<View, TabProps>((props, forwardedRef) => {
    const {
      children,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      onPress,
      style,
      ...otherProps
    } = props;

    const {
      isDisabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handleAccessibilityAction,
      isFocusable,
      onLayout,
      ref: internalRef,
      state,
      tabIndex,
    } = useTab(props);

    const mergedRef = mergeRefs(internalRef, forwardedRef);

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && (state.active || state.focused) ? { zIndex: 1 } : undefined,
      ],
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
        onLayout,
      },
      disabled: isDisabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
        selected: state.active,
      },
    });

    return (
      <PressableWithKeyDown
        accessible
        role="tab"
        tabIndex={tabIndex}
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
