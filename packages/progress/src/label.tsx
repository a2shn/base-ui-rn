import * as React from 'react';
import { Text } from 'react-native';
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
export const ProgressLabel = React.forwardRef<Text, ProgressLabelProps>(
  (props, ref) => {
    const {
      children,
      nativeID,
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
    const { labelId, isComplete, isIndeterminate, isProgressing } =
      useProgressContext();

    return (
      <Text
        {...other}
        ref={ref}
        nativeID={nativeID ?? labelId}
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
        {children}
      </Text>
    );
  },
);

ProgressLabel.displayName = 'Progress.Label';
