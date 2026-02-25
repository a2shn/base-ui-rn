import * as React from 'react';
import { View } from 'react-native';
import {
  ToggleGroupContext,
  type ToggleGroupChangeEventDetails,
} from '@base-ui-rn/toggle';
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
      style,
      ...other
    } = props;

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
      }),
      [value, disabled, multiple, orientation, loopFocus],
    );

    const contextValue = React.useMemo(
      () => ({
        ...state,
        multiple,
        toggleValue,
        valueSet,
        registerValue,
      }),
      [state, multiple, toggleValue, valueSet, registerValue],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View {...other} ref={ref} style={resolvedStyle}>
          {resolvedChildren}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
