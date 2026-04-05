import {
  evaluateStyles,
  PressableWithKeyDown,
  mergeProps,
  mergeRefs,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { View, type PressableStateCallbackType } from 'react-native';

import { useOptionalRadioGroupContext } from './radio-group-context';
import { RadioRootContext } from './radio-root-context';
import type { RadioRootProps } from './types';
import { useRadioRoot } from './use-radio';

/**
 * Headless radio root primitive built on top of React Native Pressable.
 *
 * A single radio button that can be used standalone or within a RadioGroup.
 * Supports keyboard interaction, focus management, and accessibility states.
 *
 * @example
 * ```tsx
 * <Radio.Root value="option-a">
 *   <Radio.Indicator />
 * </Radio.Root>
 * ```
 */
export const RadioRoot = React.memo(
  React.forwardRef<View, RadioRootProps>((props, ref) => {
    const { children, style, value, ...otherProps } = props;

    const groupContext = useOptionalRadioGroupContext();

    const internalRef = React.useRef<View>(null);
    const mergedRef = mergeRefs(internalRef, ref);

    const {
      checked,
      disabled: isDisabled,
      focusRingStyle,
      handleAccessibilityAction,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      isFocusable,
      readOnly: isReadOnly,
      state,
      tabIndex,
    } = useRadioRoot(props, groupContext);

    React.useEffect(() => {
      if (groupContext && value && internalRef.current) {
        const unregister = groupContext.registerItem(value, internalRef);
        return unregister;
      }
      return undefined;
    }, [value, groupContext]);

    const resolvedStyle = useStyle({
      additionalStyles: focusRingStyle,
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        checked: state.checked,
        disabled: state.disabled,
      },
      accessibilityActions: !isDisabled ? [{ name: 'activate' }] : [],
      accessibilityHint: 'Selects the radio option',
    });

    return (
      <RadioRootContext.Provider value={state}>
        <PressableWithKeyDown
          accessible={isFocusable}
          importantForAccessibility={isFocusable ? 'yes' : 'no'}
          role='radio'
          {...mergedProps}
          disabled={isDisabled}
          focusable={isFocusable}
          tabIndex={tabIndex}
        >
          {(pressableState: PressableStateCallbackType) =>
            evaluateStyles(children, { ...pressableState, ...state })
          }
        </PressableWithKeyDown>
      </RadioRootContext.Provider>
    );
  }),
);

RadioRoot.displayName = 'Radio.Root';
