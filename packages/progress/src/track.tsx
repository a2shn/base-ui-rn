import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressTrackProps } from './types';

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
export const ProgressTrack = React.memo(
  React.forwardRef<View, ProgressTrackProps>((props, ref) => {
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
      style,
      ...otherProps
    } = props;
    const context = useProgressContext();
    const { isComplete, isIndeterminate, isProgressing } = context;

    const resolvedChildren = evaluateStyles(children, context);
    const resolvedStyle = evaluateStyles(style, context);

    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-complete={dataComplete ?? (isComplete ? 'true' : undefined)}
        data-indeterminate={
          dataIndeterminate ?? (isIndeterminate ? 'true' : undefined)
        }
        data-progressing={
          dataProgressing ?? (isProgressing ? 'true' : undefined)
        }
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={resolvedStyle}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

ProgressTrack.displayName = 'Progress.Track';
