import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressLabelProps } from './types';

/**
 * An accessible label for the progress bar.
 *
 * Automatically linked to the `Progress.Root` via `aria-labelledby`.
 *
 * @example
 * ```tsx
 * <Progress.Label>Export data</Progress.Label>
 * ```
 */
export const ProgressLabel = React.memo(
  React.forwardRef<Text, ProgressLabelProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      children,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      nativeID,
      style,
      ...other
    } = props;
    const context = useProgressContext();
    const { isComplete, isIndeterminate, isProgressing, labelId } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <Text
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden}
        aria-labelledby={ariaLabelledBy}
        nativeID={nativeID ?? labelId}
        ref={ref}
        style={resolvedStyle}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      >
        {resolvedChildren}
      </Text>
    );
  }),
);

ProgressLabel.displayName = 'Progress.Label';
