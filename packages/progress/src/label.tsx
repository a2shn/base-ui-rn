import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressLabelProps } from './types';

/**
 * An accessible label for the progress bar.
 *
 * Automatically linked to the `Progress.Root` via `accessibilityLabelledBy`.
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

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <Text
        {...props}
        nativeID={nativeID ?? labelId}
        ref={ref}
        style={resolvedStyle}
      >
        {resolvedChildren}
      </Text>
    );
  }),
);

ProgressLabel.displayName = 'Progress.Label';
