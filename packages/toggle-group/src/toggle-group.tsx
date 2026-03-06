/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { View, Platform, type NativeSyntheticEvent } from 'react-native';
import {
  ToggleGroupContext,
  type ToggleGroupChangeEventDetails,
} from '@base-ui-rn/toggle';
import {
  type KeyPressEventData,
  type WebToggleGroupAccessibilityProps,
  DEFAULT_FOCUS_RING_STYLE,
  useKeyboardNavigation,
} from '@base-ui-rn/core';
import { useFocus } from '@base-ui-rn/focus-ring';
import { type ToggleGroupProps, type ToggleGroupState } from './types';

/**
 * Headless toggle-group primitive for React Native.
 *
 * @param value
 * The controlled value of the toggle group.
 *
 * @param defaultValue
 * The default value of the toggle group when uncontrolled.
 *
 * @param onValueChange
 * Callback fired when the value changes.
 *
 * @param multiple
 * Whether multiple items can be pressed at once.
 *
 * @param disabled
 * Whether the entire group is disabled.
 *
 * @param orientation
 * The orientation of the group, used for keyboard navigation.
 *
 * @param disableDefaultFocusRing
 * Whether to disable the default blue focus ring styling that appears on keyboard focus.
 *
 * @param focusVisible
 * Forces the focus ring to be visible.
 *
 * @param loopFocus
 * Whether keyboard focus should loop back to the start/end.
 *
 * @param onFocusChange
 * Callback fired when the focused item in the group changes.
 *
 * @default orientation 'horizontal'
 * @default loopFocus true
 * @default multiple false
 * @default disabled false
 * @default disableDefaultFocusRing false
 *
 * @example
 * ```tsx
 * <ToggleGroup value={value} onValueChange={setValue} multiple>
 *   <Toggle value="bold">
 *     <Text>Bold</Text>
 *   </Toggle>
 *   <Toggle value="italic">
 *     <Text>Italic</Text>
 *   </Toggle>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = React.forwardRef<View, ToggleGroupProps>(
  (props, ref) => {
    const {
      children,
      value: controlledValue,
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
      ...other
    } = props;

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!);

    const { focused, focusVisible, onFocus, onBlur } = useFocus({
      focusVisible: forceFocusVisible,
    });

    const { registerItem, handleKeyDown } = useKeyboardNavigation({
      orientation: orientation === 'both' ? 'both' : orientation,
      loop: loopFocus,
    });

    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? [],
    );

    const value = controlledValue ?? uncontrolledValue;
    const valueSet = React.useMemo(() => new Set(value), [value]);

    const toggleValue = React.useCallback(
      (itemValue: string, details: ToggleGroupChangeEventDetails) => {
        let nextValue: string[];
        if (multiple) {
          nextValue = valueSet.has(itemValue)
            ? value.filter((v) => v !== itemValue)
            : [...value, itemValue];
        } else {
          nextValue = valueSet.has(itemValue) ? [] : [itemValue];
        }

        if (controlledValue === undefined) {
          setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue, details);
      },
      [multiple, valueSet, value, controlledValue, onValueChange],
    );

    const onToggleKeyPress = React.useCallback(
      (currentValue: string, event: any) => {
        if (disabled) return;
        const nextId = handleKeyDown(currentValue, event);
        if (nextId) {
          onFocusChange?.(nextId);
        }
      },
      [disabled, handleKeyDown, onFocusChange],
    );

    const registeredValues = React.useRef<Set<string>>(new Set());
    const registerValue = React.useCallback((val: string) => {
      if (process.env.NODE_ENV !== 'production') {
        if (registeredValues.current.has(val)) {
          console.warn(
            `ToggleGroup: Duplicate value "${val}" detected. Each Toggle within a ToggleGroup must have a unique value.`,
          );
        }
        registeredValues.current.add(val);
      }
      return () => {
        if (process.env.NODE_ENV !== 'production') {
          registeredValues.current.delete(val);
        }
      };
    }, []);

    const state: ToggleGroupState = React.useMemo(
      () => ({
        value,
        disabled,
        multiple,
        orientation,
        loopFocus,
        focused,
        focusVisible,
      }),
      [
        value,
        disabled,
        multiple,
        orientation,
        loopFocus,
        focused,
        focusVisible,
      ],
    );

    const contextValue = React.useMemo(
      () => ({
        ...state,
        multiple,
        toggleValue,
        valueSet,
        registerValue,
        registerItem,
        onToggleKeyPress,
      }),
      [
        state,
        multiple,
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

    const resolvedDataOrientation =
      (props as WebToggleGroupAccessibilityProps)['data-orientation'] ??
      orientation;
    const resolvedDataDisabled =
      (props as WebToggleGroupAccessibilityProps)['data-disabled'] ?? disabled;
    const resolvedDataMultiple =
      (props as WebToggleGroupAccessibilityProps)['data-multiple'] ?? multiple;

    const finalStyle = [
      resolvedStyle,
      !disableDefaultFocusRing && focusVisible && DEFAULT_FOCUS_RING_STYLE,
    ];

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View
          {...other}
          ref={internalRef}
          style={finalStyle}
          role={(other.accessibilityRole ?? 'group') as unknown as 'checkbox'}
          aria-orientation={orientation}
          onFocus={(e) => {
            onFocus();
            other.onFocus?.(e);
          }}
          onBlur={(e) => {
            onBlur();
            other.onBlur?.(e);
          }}
          {...({
            'data-orientation': resolvedDataOrientation,
            'data-disabled': resolvedDataDisabled,
            'data-multiple': resolvedDataMultiple,
          } as Record<string, unknown>)}
        >
          {resolvedChildren}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
