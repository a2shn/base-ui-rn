import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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
export const AccordionRoot = React.memo(
  React.forwardRef<View, AccordionRootProps>((props, ref) => {
    const {
      children,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-disabled': ariaDisabled,
      'aria-keyshortcuts': ariaKeyshortcuts,
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
      onTriggerKeyDown,
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
        onTriggerKeyDown,
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
        onTriggerKeyDown,
      ],
    );

    return (
      <React.Fragment>
        <AccordionContext.Provider value={contextValue}>
          <View
            {...otherProps}
            ref={ref}
            style={evaluateStyles(style, state)}
            role='group'
            aria-orientation={orientation}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            aria-details={ariaDetails}
            aria-expanded={ariaExpanded}
            aria-busy={ariaBusy}
            aria-hidden={ariaHidden}
            aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
            aria-keyshortcuts={ariaKeyshortcuts}
            data-orientation={dataOrientation ?? orientation}
            data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
          >
            {evaluateStyles(children, state)}
          </View>
        </AccordionContext.Provider>
      </React.Fragment>
    );
  },
);

AccordionRoot.displayName = 'AccordionRoot';
