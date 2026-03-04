/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { View, type NativeSyntheticEvent } from 'react-native';
import {
  ToggleGroupContext,
  type ToggleGroupChangeEventDetails,
} from '@base-ui-rn/toggle';
import {
  type KeyPressEventData,
  type WebToggleGroupAccessibilityProps,
} from '@base-ui-rn/core';
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

    const registeredItems = React.useRef<Map<string, React.RefObject<unknown>>>(
      new Map(),
    );
    // Use a Ref for ordered values to avoid re-registration loops that cause OOM.
    const orderedValuesRef = React.useRef<string[]>([]);

    const registerItem = React.useCallback(
      (val: string, itemRef: React.RefObject<unknown>) => {
        registeredItems.current.set(val, itemRef);
        if (!orderedValuesRef.current.includes(val)) {
          orderedValuesRef.current.push(val);
        }
        return () => {
          registeredItems.current.delete(val);
          orderedValuesRef.current = orderedValuesRef.current.filter(
            (v) => v !== val,
          );
        };
      },
      [],
    );

    const onToggleKeyPress = React.useCallback(
      (currentValue: string, event: unknown) => {
        if (disabled) return;

        const key = (event as NativeSyntheticEvent<KeyPressEventData>)
          .nativeEvent.key;
        const isHorizontal = orientation === 'horizontal';
        const isVertical = orientation === 'vertical';

        let direction: 'next' | 'prev' | null = null;

        if (isHorizontal) {
          if (key === 'ArrowRight') direction = 'next';
          else if (key === 'ArrowLeft') direction = 'prev';
        } else if (isVertical) {
          if (key === 'ArrowDown') direction = 'next';
          else if (key === 'ArrowUp') direction = 'prev';
        }

        if (direction) {
          const orderedValues = orderedValuesRef.current;
          const currentIndex = orderedValues.indexOf(currentValue);
          if (currentIndex === -1) return;

          let nextIndex: number;
          if (direction === 'next') {
            nextIndex = currentIndex + 1;
            if (nextIndex >= orderedValues.length) {
              nextIndex = loopFocus ? 0 : currentIndex;
            }
          } else {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = loopFocus ? orderedValues.length - 1 : currentIndex;
            }
          }

          if (nextIndex !== currentIndex) {
            const nextValue = orderedValues[nextIndex];
            onFocusChange?.(nextValue);

            const nextRef = registeredItems.current.get(nextValue);
            if (nextRef?.current) {
              const element = nextRef.current as any;
              if (typeof element.focus === 'function') {
                element.focus();
              } else if (
                element.current &&
                typeof element.current.focus === 'function'
              ) {
                element.current.focus();
              }
            }
          }
        }
      },
      [disabled, orientation, loopFocus, onFocusChange],
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

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View
          {...other}
          ref={ref}
          style={resolvedStyle}
          role={
            (other.accessibilityRole ?? 'group') as unknown as 'checkbox'
          }
          aria-orientation={orientation}
          {...({
            'data-orientation': resolvedDataOrientation,
            'data-disabled': resolvedDataDisabled,
            'data-multiple': resolvedDataMultiple,
          } as any)}
        >
          {resolvedChildren}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
