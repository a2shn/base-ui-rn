import * as React from 'react';
import { Text } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
import type { ProgressLabelProps } from './types';
import { useProgressContext } from './progress-context';

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
      children,
      nativeID,
      style,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      ...other
    } = props;
    const context = useProgressContext();
    const { labelId, isComplete, isIndeterminate, isProgressing } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
        style={resolvedStyle}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
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
  },
);

ProgressLabel.displayName = 'Progress.Label';
