import * as React from 'react';
import { View } from 'react-native';
import type { ProgressTrackProps } from './types';
import { useProgressContext } from './progress-context';

/**
 * Contains the progress indicator and represents the entire range of the progress bar.
 *
 * Hidden from accessibility as it's purely visual.
 */
export const ProgressTrack = React.forwardRef<View, ProgressTrackProps>(
  (props, ref) => {
    const {
      children,
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
    const { isComplete, isIndeterminate, isProgressing } = useProgressContext();

    return (
      <View
        {...other}
        ref={ref}
        importantForAccessibility='no-hide-descendants'
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
        {children}
      </View>
    );
  },
);

ProgressTrack.displayName = 'Progress.Track';
