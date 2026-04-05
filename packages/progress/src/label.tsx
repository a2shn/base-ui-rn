import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressLabelProps } from './types';

/**
 * An accessible label for the progress bar.
 *
 * @example
 * ```tsx
 * <Progress.Label>Export data</Progress.Label>
 * ```
 */
export const ProgressLabel = React.memo(
  React.forwardRef<Text, ProgressLabelProps>((props, ref) => {
    const { children, nativeID, style } = props;
    const context = useProgressContext();
    const { labelId } = context;

    const resolvedStyle = useStyle({
      state: context,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <Text nativeID={nativeID ?? labelId} {...mergedProps}>
        {evaluateStyles(children, context)}
      </Text>
    );
  }),
);

ProgressLabel.displayName = 'Progress.Label';
