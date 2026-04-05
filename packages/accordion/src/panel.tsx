import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { AccordionPanelProps } from './types';
import { useAccordionPanel } from './use-accordion';

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
    const { children, style } = props;

    const {
      handleOnLayout,
      open,
      shouldRender,
      state,
    } = useAccordionPanel(props);

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      onLayout: handleOnLayout,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        expanded: open,
      },
    });

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

AccordionPanel.displayName = 'Accordion.Panel';
