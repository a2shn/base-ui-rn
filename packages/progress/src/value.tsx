import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, style } = props;
    const context = useProgressContext();
    const { formattedValue } = context;

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        {...mergedProps}
      >
        {evaluateStyles(children, context) ?? formattedValue}
      </Text>
    );
  }),
);

ProgressValue.displayName = 'Progress.Value';
