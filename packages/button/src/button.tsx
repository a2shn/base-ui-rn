import {
  evaluateStyles,
  PressableWithKeyDown,
  mergeProps,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useButton } from './use-button';
import { ButtonProps } from './types';

export const Button = React.memo(
  React.forwardRef<View, ButtonProps>(function Button(props, ref) {
    const { children, style } = props;

    const internalRef = React.useRef<View>(null);

    const {
      focused,
      focusVisible,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handlePressIn,
      handlePressOut,
      isDisabled,
      isFocusable,
      pressed,
      tabIndex,
    } = useButton(props);

    const buttonState = React.useMemo(
      () => ({ disabled: isDisabled, focused, focusVisible, pressed }),
      [focused, focusVisible, isDisabled, pressed]
    );

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state: buttonState,
      style,
    });

    const mergedProps = mergeProps(props, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      ref: [internalRef, ref],
      style: resolvedStyle,
      accessibilityState: { disabled: isDisabled, selected: pressed },
      accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
    });

    return (
      <PressableWithKeyDown
        accessibilityHint="Activates the button"
        accessible={true}
        importantForAccessibility={isFocusable ? 'yes' : 'no'}
        role="button"
        {...mergedProps}
        tabIndex={tabIndex}
        disabled={isDisabled}
        focusable={isFocusable}
      >
        {(pressableState: any) =>
          evaluateStyles(children, { ...pressableState, ...buttonState })
        }
      </PressableWithKeyDown>
    );
  })
);
