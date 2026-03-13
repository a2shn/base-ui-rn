import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
} from 'react-native';
import { DEFAULT_FOCUS_RING_STYLE } from '@base-ui-rn/core';
import { useAccordionItemContext } from './context';
import type { AccordionTriggerProps, KeyPressEventData } from './types';
import { useAccordionTrigger } from './use-accordion';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
    } & React.RefAttributes<View>
  >;

export const AccordionTrigger = React.forwardRef<View, AccordionTriggerProps>(
  (props, ref) => {
    const {
      children,
      style,
      disableDefaultFocusRing = false,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-panel-open': dataPanelOpen,
      'data-disabled': dataDisabled,
      ...otherProps
    } = props;

    const {
      disabled,
      handlePress,
      handleKeyPress,
      handleFocus,
      handleBlur,
      focusVisible,
      state,
      open,
    } = useAccordionTrigger(props);

    const itemContext = useAccordionItemContext();
    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    React.useLayoutEffect(() => {
      itemContext.registerTriggerRef(internalRef);
    }, [itemContext]);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      resolvedStyle,
      !disableDefaultFocusRing && focusVisible && DEFAULT_FOCUS_RING_STYLE,
    ];

    return (
      <PressableWithKeyPress
        {...otherProps}
        ref={internalRef}
        disabled={disabled}
        onPress={handlePress}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={finalStyle}
        accessible
        role='button'
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        accessibilityState={{
          expanded: open,
          disabled,
        }}
        aria-expanded={ariaExpanded ?? open}
        data-panel-open={dataPanelOpen ?? (open ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
      >
        {resolvedChildren}
      </PressableWithKeyPress>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';
