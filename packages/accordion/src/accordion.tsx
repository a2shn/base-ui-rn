import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
 * <Accordion.Item value="item-1">...</Accordion.Item>
 * </Accordion.Root>
 * ```
 */
export const AccordionRoot = React.memo(
  React.forwardRef<View, AccordionRootProps>((props, ref) => {
    const { children, style, } = props;

    const {
      baseId,
      isDisabled,
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
        isDisabled,
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
        isDisabled,
        getItemIndex,
        getItemRef,
        multiple,
        onTriggerKeyDown,
        openItems,
        orientation,
        registerItem,
        registerTrigger,
        toggleItem,
      ],
    );

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: isDisabled,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
      },
    });

    return (
      <AccordionContext.Provider value={contextValue}>
        <View role="group" {...mergedProps}>
          {evaluateStyles(children, state)}
        </View>
      </AccordionContext.Provider>
    );
  }),
);

AccordionRoot.displayName = 'Accordion.Root';
