import {
  evaluateStyles,
  PressableWithKeyDown,
} from '@base-ui-rn/core';
import * as React from 'react';
import { type StyleProp, View, ViewStyle } from 'react-native';

import { useToggleGroupContext } from './group-context';
import { type ToggleProps } from './types';
import { useToggle } from './use-toggle';
import { useToggleA11y } from './use-toggle-a11y';

/**
 * Headless toggle primitive built on top of React Native Pressable.
 *
 * A two-state button that can be pressed or not pressed. Supports keyboard
 * interaction, focus behavior, and ARIA attributes for web.
 *
 * @example
 * ```tsx
 * <Toggle>
 *   {({ pressed }) => <Text>{pressed ? 'ON' : 'OFF'}</Text>}
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Toggle(props, forwardedRef) {
    const {
      children,
      hitSlop,
      style,
      value,
      ...otherProps
    } = props;

    const groupContext = useToggleGroupContext();
    const {
      state,
      isFocusable,
      focusRingStyle,
      handlePress,
      handleKeyDown,
      handleAccessibilityAction,
      handleFocus,
      handleBlur,
      tabIndex,
      isInGroup,
    } = useToggle(props);

    const a11yProps = useToggleA11y({ isFocusable, props, state });

    if (__DEV__ && isInGroup && value === undefined) {
      console.warn(
        '[Toggle] A Toggle used within a ToggleGroup must have a "value" prop.',
      );
    }

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(forwardedRef, () => internalRef.current!);

    React.useEffect(() => {
      if (groupContext && value !== undefined) {
        return groupContext.registerItem(value, internalRef);
      }
      return undefined;
    }, [value, groupContext]);

    React.useEffect(() => {
      if (groupContext && value !== undefined) {
        return groupContext.registerValue(value);
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
      <PressableWithKeyDown
        {...otherProps}
        {...a11yProps}
        disabled={state.disabled}
        focusable={isFocusable}
        hitSlop={hitSlop}
        onAccessibilityAction={handleAccessibilityAction}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {(pressableState) =>
          evaluateStyles(children, {
            ...pressableState,
            ...state,
          })
        }
      </PressableWithKeyDown>
    );
  }),
);

Toggle.displayName = 'Toggle';
