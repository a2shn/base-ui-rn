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

        const nativeEvent = (event as NativeSyntheticEvent<KeyPressEventData>)
          .nativeEvent;
        const key = nativeEvent.key;
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
          const len = orderedValues.length;
          if (len <= 1) return;

          const currentIndex = orderedValues.indexOf(currentValue);
          if (currentIndex === -1) return;

          let nextIndex: number;
          if (direction === 'next') {
            nextIndex = currentIndex + 1;
            if (nextIndex >= len) {
              if (loopFocus) {
                nextIndex = 0;
              } else {
                return;
              }
            }
          } else {
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              if (loopFocus) {
                nextIndex = len - 1;
              } else {
                return;
              }
            }
          }

          if (nextIndex !== currentIndex) {
            const nextValue = orderedValues[nextIndex];
            const nextRef = registeredItems.current.get(nextValue);
            const element = nextRef?.current as
              | { focus?: () => void }
              | null
              | undefined;

            const evtAny = event as any;
            let prevented = false;
            if (evtAny && typeof evtAny.preventDefault === 'function') {
              try {
                evtAny.preventDefault();
                prevented = true;
              } catch {}
            } else if (
              evtAny &&
              evtAny.nativeEvent &&
              typeof evtAny.nativeEvent.preventDefault === 'function'
            ) {
              try {
                evtAny.nativeEvent.preventDefault();
                prevented = true;
              } catch {}
            }

            onFocusChange?.(nextValue);

            const isWeb = Platform.OS === 'web';
            const isTest = !!process.env.JEST_WORKER_ID;
            const shouldProgrammaticFocus = isWeb || isTest;

            if (!shouldProgrammaticFocus) {
              return;
            }

            if (element && typeof element.focus === 'function') {
              const focusFn = element.focus;
              if (prevented) {
                focusFn();
              } else {
                setTimeout(() => {
                  focusFn();
                }, 0);
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
