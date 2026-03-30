import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressValueProps } from './types';

/**
 * A text element displaying the current value of the progress.
 *
 * Hidden from accessibility to avoid redundant announcements.
 *
 * @example
 * ```tsx
 * <Progress.Value />
 * ```
 */
export const ProgressValue = React.memo(
  React.forwardRef<Text, ProgressValueProps>((props, ref) => {
    const { children, style } = props;
    const context = useProgressContext();
    const { formattedValue } = context;

    const resolvedStyle = evaluateStyles(style, context);
    const resolvedChildren = evaluateStyles(children, context);

    return (
      <Text
        {...props}
        // Purely visual — the root's accessibilityValue.text already
        // communicates the value to screen readers
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={resolvedStyle}
      >
        {resolvedChildren ?? formattedValue}
      </Text>
    );
  }),
);

ProgressValue.displayName = 'Progress.Value';
