import { evaluateStyles } from '@base-ui-rn/core';
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
export const AccordionRoot = React.memo(
  React.forwardRef<View, AccordionRootProps>((props, ref) => {
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
      'data-disabled': dataDisabled,
      'data-orientation': dataOrientation,
      style,
      ...otherProps
    } = props;

    const {
      baseId,
      disabled,
      getItemIndex,
      getItemRef,
      multiple,
      onTriggerKeyDown,
      openItems,
      orientation,
      registerItem,
      registerTrigger,
      state,
      toggleItem,
    } = useAccordionRoot(props);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        disabled,
        getItemIndex,
        getItemRef,
        multiple,
        onTriggerKeyDown,
        openItems,
        orientation,
        registerItem,
        registerTrigger,
        toggleItem,
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
            aria-busy={ariaBusy}
            aria-describedby={ariaDescribedBy}
            aria-details={ariaDetails}
            aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
            aria-expanded={ariaExpanded}
            aria-hidden={ariaHidden}
            aria-keyshortcuts={ariaKeyshortcuts}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-orientation={orientation}
            data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
            data-orientation={dataOrientation ?? orientation}
            ref={ref}
            role='group'
            style={evaluateStyles(style, state)}
          >
            {evaluateStyles(children, state)}
          </View>
        </AccordionContext.Provider>
      </React.Fragment>
    );
  }),
);

AccordionRoot.displayName = 'AccordionRoot';
