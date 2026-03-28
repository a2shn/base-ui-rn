import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useOptionalRadioGroupContext } from './radio-group-context';
import { RadioRootContext } from './radio-root-context';
import type { RadioRootProps } from './types';
import { useRadioRoot } from './use-radio';

/**
 * Represents a single radio button within a RadioGroup.
 *
 * Renders a pressable element with role "radio". Its checked state is derived
 * from the parent RadioGroup's selected value. Provides context to Radio.Indicator.
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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      id,
      style,
      value,
      ...otherProps
    } = props;

    const groupContext = useOptionalRadioGroupContext();

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

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
      mergedAccessibilityActions,
      readOnly: isReadOnly,
      state,
      tabIndex,
    } = useRadioRoot(props, groupContext);

    // Register this radio with the group for keyboard navigation
    React.useEffect(() => {
      if (groupContext && value !== undefined) {
        return groupContext.registerItem(value, internalRef);
      }
      return undefined;
    }, [value, groupContext]);

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const baseStyle = evaluateStyles(style, state);
      if (focusRingStyle) {
        return [baseStyle, focusRingStyle];
      }
      return baseStyle;
    }, [style, state, focusRingStyle]);

    return (
      <RadioRootContext.Provider value={state}>
        <PressableWithKeyPress
          {...otherProps}
          accessibilityActions={mergedAccessibilityActions}
          accessibilityRole='radio'
          accessibilityState={{
            checked,
            disabled: isDisabled,
          }}
          accessible={isFocusable}
          aria-busy={ariaBusy}
          aria-checked={checked}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={isDisabled}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-checked={checked ? 'true' : undefined}
          data-disabled={isDisabled ? 'true' : undefined}
          data-readonly={isReadOnly ? 'true' : undefined}
          data-unchecked={!checked ? 'true' : undefined}
          disabled={isDisabled}
          focusable={isFocusable}
          importantForAccessibility='yes'
          nativeID={id}
          onAccessibilityAction={handleAccessibilityAction}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPress={handlePress}
          ref={internalRef}
          role='radio'
          style={resolvedStyle}
          tabIndex={tabIndex}
        >
          {evaluateStyles(children, state)}
        </PressableWithKeyPress>
      </RadioRootContext.Provider>
    );
  }),
);

RadioRoot.displayName = 'Radio.Root';
