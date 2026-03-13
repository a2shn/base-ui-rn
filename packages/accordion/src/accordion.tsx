import * as React from 'react';
import { View } from 'react-native';
import { AccordionContext } from './context';
import type { AccordionRootProps } from './types';
import { useAccordionRoot } from './use-accordion';

/**
 * Headless accordion root primitive built on top of React Native View.
 *
 * Provides the state and context for all accordion items. Supports keyboard
 * navigation, multiple open items, and controlled/uncontrolled state.
 *
 * @example
 * ```tsx
 * <Accordion.Root defaultValue="item-1">
 *   <Accordion.Item value="item-1">...</Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const AccordionRoot = React.forwardRef<View, AccordionRootProps>(
  (props, ref) => {
    const {
      children,
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-orientation': dataOrientation,
      'data-disabled': dataDisabled,
      ...otherProps
    } = props;

    const {
      baseId,
      orientation,
      disabled,
      multiple,
      openItems,
      registerItem,
      registerTrigger,
      toggleItem,
      getItemIndex,
      getItemRef,
      onTriggerKeyPress,
      state,
    } = useAccordionRoot(props);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        orientation,
        disabled,
        multiple,
        openItems,
        registerItem,
        registerTrigger,
        toggleItem,
        getItemIndex,
        getItemRef,
        onTriggerKeyPress,
      }),
      [
        baseId,
        orientation,
        disabled,
        multiple,
        openItems,
        registerItem,
        registerTrigger,
        toggleItem,
        getItemIndex,
        getItemRef,
        onTriggerKeyPress,
      ],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <React.Fragment>
        <AccordionContext.Provider value={contextValue}>
          <View
            {...otherProps}
            ref={ref}
            style={resolvedStyle}
            role='group'
            aria-orientation={orientation}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-details={ariaDetails}
            aria-expanded={ariaExpanded}
            aria-busy={ariaBusy}
            aria-hidden={ariaHidden}
            data-orientation={dataOrientation ?? orientation}
            data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
          >
            {resolvedChildren}
          </View>
        </AccordionContext.Provider>
      </React.Fragment>
    );
  },
);

AccordionRoot.displayName = 'AccordionRoot';
