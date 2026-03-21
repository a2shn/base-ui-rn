import * as React from 'react';
import { View } from 'react-native';
import { ToggleGroupContext } from '@base-ui-rn/toggle';
import { evaluateStyles } from '@base-ui-rn/core';
import { type ToggleGroupProps } from './types';
import { useToggleGroup } from './use-toggle-group';

/**
 * Headless toggle group primitive for React Native.
 *
 * Coordinates the state of multiple toggles. Supports single and multiple
 * selection, keyboard navigation, and looping focus.
 *
 * @example
 * ```tsx
 * <ToggleGroup type="single" defaultValue="center">
 *   <Toggle value="left">Left</Toggle>
 *   <Toggle value="center">Center</Toggle>
 *   <Toggle value="right">Right</Toggle>
 * </ToggleGroup>
 * ```
 */
export const ToggleGroup = React.memo(
  React.forwardRef<View, ToggleGroupProps>((props, ref) => {
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
      accessibilityRole,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-keyshortcuts': ariaKeyshortcuts,
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
      onToggleKeyDown,
      registerItem,
      registerValue,
      state,
      toggleValue,
      valueSet,
    } = useToggleGroup(props);

    const contextValue = React.useMemo(
      () => ({
        ...state,
        toggleValue,
        valueSet,
        registerValue,
        registerItem,
        onToggleKeyDown,
      }),
      [
        state,
        toggleValue,
        valueSet,
        registerValue,
        registerItem,
        onToggleKeyDown,
      ],
    );

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <View
          {...otherViewProps}
          ref={internalRef}
          style={evaluateStyles(style, state)}
          role={(accessibilityRole ?? 'group') as unknown as 'checkbox'}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-keyshortcuts={ariaKeyshortcuts}
          aria-disabled={ariaDisabled ?? disabled}
          aria-orientation={ariaOrientationProp ?? orientation}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-orientation={dataOrientation ?? orientation}
          data-disabled={dataDisabled ?? disabled}
          data-multiple={dataMultiple ?? multiple}
        >
          {evaluateStyles(children, state)}
        </View>
      </ToggleGroupContext.Provider>
    );
  },
  ));

ToggleGroup.displayName = 'ToggleGroup';
