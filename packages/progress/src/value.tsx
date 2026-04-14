import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressValueProps } from './types';

/**
 * A text element displaying the current value of the progress.
 *
 * @example
 * ```tsx
 * <Progress.Value />
 * ```
 */
export const ProgressValue = React.memo(
  React.forwardRef<Text, ProgressValueProps>((props, ref) => {
    const { children, style, ...otherProps } = props;
    const context = useProgressContext();
    const { formattedValue } = context;

    const resolvedStyle = resolveValue(style, context);
    const mergedProps = mergeProps(
      { style: resolvedStyle },
      { ref },
      otherProps,
      {
        accessibilityElementsHidden: true,
        disabled: false,
        focusable: false,
        importantForAccessibility: 'no-hide-descendants',
      },
    );

    return (
      <Text {...mergedProps}>
        {resolveValue(children, context) ?? formattedValue}
      </Text>
    );
  }),
);

ProgressValue.displayName = 'Progress.Value';
