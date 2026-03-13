import * as React from 'react';
import {
  View,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';
import { ToggleGroupContext } from '@base-ui-rn/toggle';
import { DEFAULT_FOCUS_RING_STYLE } from '@base-ui-rn/core';
import { type ToggleGroupProps } from './types';
import { useToggleGroup } from './use-toggle-group';

/**
 * Headless toggle-group primitive for React Native.
 */
export const ToggleGroup = React.forwardRef<View, ToggleGroupProps>(
  (props, ref) => {
    const {
      children,
      value,
      defaultValue,
      onValueChange,
      multiple = false,
      disabled = false,
      orientation = 'horizontal',
      loopFocus = true,
      onFocusChange,
      style,
      focusVisible: forceFocusVisible = false,
      disableDefaultFocusRing = false,
      accessibilityRole,
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      tabIndex,
      'aria-disabled': ariaDisabled,
      'aria-orientation': ariaOrientationProp,
      'data-orientation': dataOrientation,
      'data-disabled': dataDisabled,
      'data-multiple': dataMultiple,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherViewProps
    } = props;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    const {
      onBlur,
      onFocus,
      onToggleKeyPress,
      registerItem,
      registerValue,
      state,
      toggleValue,
      valueSet,
    } = useToggleGroup({
      value,
      defaultValue,
      onValueChange,
      multiple,
      disabled,
      orientation,
      loopFocus,
      onFocusChange,
      focusVisible: forceFocusVisible,
    });

    const contextValue = React.useMemo(
      () => ({
        ...state,
        toggleValue,
        valueSet,
        registerValue,
        registerItem,
        onToggleKeyPress,
      }),
      [
        state,
        toggleValue,
        valueSet,
        registerValue,
        registerItem,
        onToggleKeyPress,
      ],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      resolvedStyle,
      !disableDefaultFocusRing &&
        state.focusVisible &&
        DEFAULT_FOCUS_RING_STYLE,
    ];

    const handleFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
      onFocus();
      onFocusProp?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
      onBlur();
      onBlurProp?.(event);
    };

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          ref={internalRef}
          style={finalStyle}
          role={(accessibilityRole ?? 'group') as unknown as 'checkbox'}
          tabIndex={tabIndex}
          aria-disabled={ariaDisabled ?? disabled}
          aria-orientation={ariaOrientationProp ?? orientation}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-orientation={dataOrientation ?? orientation}
          data-disabled={dataDisabled ?? disabled}
          data-multiple={dataMultiple ?? multiple}
        >
          {resolvedChildren}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
