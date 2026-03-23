import {
  evaluateStyles,
  type KeyPressEventData,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type NativeSyntheticEvent, View } from 'react-native';

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
 *   {({ active }) => <Text style={{ color: active ? 'blue' : 'black' }}>Tab 1</Text>}
 * </Tabs.Tab>
 * ```
 */
export const Tab = React.memo(
  React.forwardRef<View, TabProps>((props, forwardedRef) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      'data-activation-direction': dataActivationDirection,
      'data-active': dataActive,
      'data-disabled': dataDisabled,
      'data-orientation': dataOrientation,
      disabled,
      disableDefaultFocusRing = false,
      focusRingStyle,
      focusVisible: forceFocusVisible = false,
      style,
      tabIndex,
      value,
      ...otherProps
    } = props;

    const {
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      onLayout,
      ref,
      state,
    } = useTab({
      disabled,
      focusVisible: forceFocusVisible,
      value,
    });

    React.useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <PressableWithKeyPress
        {...otherProps}
        accessible
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={state.disabled}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-selected={state.active}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
        data-active={dataActive ?? (state.active ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (state.disabled ? 'true' : undefined)}
        data-orientation={dataOrientation ?? state.orientation}
        disabled={state.disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={(e: unknown) =>
          handleKeyDown(e as NativeSyntheticEvent<KeyPressEventData>)
        }
        onLayout={onLayout}
        onPress={handlePress}
        ref={ref}
        role='tab'
        style={() =>
          evaluateStyles(style, state, {
            disableDefaultFocusRing,
            focusRingStyle,
          })
        }
        tabIndex={tabIndex}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyPress>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
