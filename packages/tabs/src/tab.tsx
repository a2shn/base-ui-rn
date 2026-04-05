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
  React.forwardRef<View, TabProps>((props, ref) => {
    const {
      children,
      style,
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
      handleOnLayout,
      ref: internalRef,
      state,
      tabIndex,
    } = useTab(props);

    const mergedRef = mergeRefs(internalRef, ref);

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && (state.active || state.focused) ? { zIndex: 1 } : undefined,
      ],
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      onAccessibilityAction: handleAccessibilityAction,
      onLayout: handleOnLayout,
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
        {...mergedProps}
        tabIndex={tabIndex}
        disabled={isDisabled}
        focusable={isFocusable}

      >
        {evaluateStyles(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
