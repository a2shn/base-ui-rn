import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressIndicatorProps } from './types';

/**
 * Visualizes the progress bar's completion status.
 *
 * Automatically applies the width based on the progress's percentage.
 * Hidden from accessibility as it's purely visual.
 *
 * @example
 * ```tsx
 * <Progress.Indicator style={{ backgroundColor: 'blue' }} />
 * ```
 */
export const ProgressIndicator = React.memo(
  React.forwardRef<View, ProgressIndicatorProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-labelledby': ariaLabelledBy,
      'data-complete': dataComplete,
      'data-indeterminate': dataIndeterminate,
      'data-progressing': dataProgressing,
      style,
      ...other
    } = props;
    const context = useProgressContext();
    const { isComplete, isIndeterminate, isProgressing, percentage } = context;

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      if (typeof percentage !== 'number') return {};
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    const resolvedStyle = evaluateStyles(style, context);

    return (
      <View
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? true}
        aria-labelledby={ariaLabelledBy}
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={[indicatorStyle, resolvedStyle]}
        {...({
          'data-complete': dataComplete ?? (isComplete ? '' : undefined),
          'data-indeterminate':
            dataIndeterminate ?? (isIndeterminate ? '' : undefined),
          'data-progressing':
            dataProgressing ?? (isProgressing ? '' : undefined),
        } as Record<string, unknown>)}
      />
    );
  }),
);

ProgressIndicator.displayName = 'Progress.Indicator';
