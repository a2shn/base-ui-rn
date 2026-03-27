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
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      nativeID,
      style,
      ...otherProps
    } = props;
    const context = useProgressContext();
    const { isComplete, isIndeterminate, isProgressing, labelId } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <Text
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-complete={dataComplete ?? (isComplete ? 'true' : undefined)}
        data-indeterminate={
          dataIndeterminate ?? (isIndeterminate ? 'true' : undefined)
        }
        data-progressing={
          dataProgressing ?? (isProgressing ? 'true' : undefined)
        }
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
