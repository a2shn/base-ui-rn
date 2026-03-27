import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, View } from 'react-native';

import type { CollapsibleTriggerProps } from './types';
import { useCollapsibleTrigger } from './use-collapsible';

/**
 * A button that opens and closes the collapsible panel.
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within a `Collapsible.Root`.
 *
 * @example
 * ```tsx
 * <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 * ```
 */
export const CollapsibleTrigger = React.memo(
  React.forwardRef<View, CollapsibleTriggerProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      style,
      tabIndex,
      ...otherProps
    } = props;

    const {
      disabled,
      focused,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      open,
      state,
      tabIndex: resolvedTabIndex,
    } = useCollapsibleTrigger({ ...otherProps, tabIndex });

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    const finalStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const baseStyle = evaluateStyles(style, state);
      const focusStyles: StyleProp<ViewStyle>[] = [baseStyle];
      if (focusRingStyle) {
        focusStyles.push(focusRingStyle);
      }
      if (Platform.OS === 'web' && (open || focused)) {
        focusStyles.push({ zIndex: 1 });
      }
      return focusStyles;
    }, [style, state, focusRingStyle, open, focused]);

    return (
      <PressableWithKeyPress
        {...otherProps}
        accessibilityState={{
          disabled,
          expanded: open,
        }}
        accessible
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
        aria-expanded={ariaExpanded ?? open}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-disabled={disabled ? 'true' : undefined}
        data-panel-open={open ? 'true' : undefined}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        role='button'
        style={finalStyle}
        tabIndex={resolvedTabIndex}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyPress>
    );
  }),
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
