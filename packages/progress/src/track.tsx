import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
import type { ProgressTrackProps } from './types';
import { useProgressContext } from './progress-context';

/**
 * Contains the progress indicator and represents the entire range of the progress bar.
 *
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Progress.Track><Progress.Indicator /></Progress.Track>
 * ```
 */
export const ProgressTrack = React.forwardRef<View, ProgressTrackProps>(
  (props, ref) => {
    const {
      children,
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
    const { isComplete, isIndeterminate, isProgressing } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
        style={resolvedStyle}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? true}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      >
        {resolvedChildren}
      </View>
    );
  },
);

ProgressTrack.displayName = 'Progress.Track';
