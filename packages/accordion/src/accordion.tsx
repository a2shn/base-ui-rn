import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { AccordionContext } from './context';
import type { AccordionRootProps } from './types';
import { useAccordion } from './use-accordion';

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
    const { children, style, ...otherProps } = props;

    const {
      baseId,
      getItemIndex,
      getItemRef,
      isDisabled,
      multiple,
      onTriggerKeyDown,
      openItems,
      orientation,
      registerItem,
      registerTrigger,
      state,
      toggleItem,
    } = useAccordion(props);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        getItemIndex,
        getItemRef,
        isDisabled,
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

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      {
        accessibilityState: { disabled: isDisabled },
      },
      { ref },
      otherProps,
      {
        focusable: false,
        role: 'group',
      },
    );

    return (
      <AccordionContext.Provider value={contextValue}>
        <View {...mergedProps} style={resolvedStyle}>
          {resolveValue(children, state)}
        </View>
      </AccordionContext.Provider>
    );
  }),
);

AccordionRoot.displayName = 'Accordion.Root';
