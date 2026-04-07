import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { AccordionPanelProps } from './types';
import { useAccordionPanel } from './use-accordion-panel';

/**
 * The content area that is revealed when an accordion item is expanded.
 *
 * Supports conditional rendering, dimension measurement variables, and
 * accessibility attributes. Must be used within an `Accordion.Item`.
 *
 * @example
 * ```tsx
 * <Accordion.Panel>
 *   <Text>Panel content here</Text>
 * </Accordion.Panel>
 * ```
 */
export const AccordionPanel = React.memo(
  React.forwardRef<View, AccordionPanelProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const { handleOnLayout, open, shouldRender, state } =
      useAccordionPanel(props);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
    {
      accessibilityState: { expanded: open },
      onLayout: handleOnLayout,
      style: resolvedStyle
    },
    { ref },
    otherProps,
    { focusable: false }
  );

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...mergedProps}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
      >
        {resolveValue(children, state)}
      </View>
    );
  }),
);

AccordionPanel.displayName = 'Accordion.Panel';
