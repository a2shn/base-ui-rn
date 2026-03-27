import { evaluateStyles } from '@base-ui-rn/core';
import { ToggleGroupContext } from '@base-ui-rn/toggle';
import * as React from 'react';
import { View } from 'react-native';

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
      accessibilityRole,
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-orientation': ariaOrientationProp,
      children,
      'data-disabled': dataDisabled,
      'data-multiple': dataMultiple,
      'data-orientation': dataOrientation,
      disabled = false,
      multiple = false,
      orientation = 'horizontal',
      style,
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
        onToggleKeyDown,
        registerItem,
        registerValue,
        toggleValue,
        valueSet,
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
          accessible
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={ariaDisabled ?? disabled}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-keyshortcuts={ariaKeyshortcuts}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-orientation={ariaOrientationProp ?? orientation}
          data-disabled={dataDisabled ?? disabled}
          data-multiple={dataMultiple ?? multiple}
          data-orientation={dataOrientation ?? orientation}
          ref={internalRef}
          role={(accessibilityRole ?? 'group') as unknown as 'checkbox'}
          style={evaluateStyles(style, state)}
        >
          {evaluateStyles(children, state)}
        </View>
      </ToggleGroupContext.Provider>
    );
  }),
);

ToggleGroup.displayName = 'ToggleGroup';
