import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import { evaluate } from '@base-ui-rn/core';
import type { ProgressIndicatorProps } from './types';
import { useProgressContext } from './progress-context';

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
export const ProgressIndicator = React.forwardRef<View, ProgressIndicatorProps>(
  (props, ref) => {
    const {
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
    const { percentage, isComplete, isIndeterminate, isProgressing } = context;

    const indicatorStyle = React.useMemo<ViewStyle>(() => {
      if (typeof percentage !== 'number') return {};
      return {
        width: `${percentage}%`,
      };
    }, [percentage]);

    const resolvedStyle = evaluate(style, context);

    return (
      <View
        {...other}
        ref={ref}
        style={[indicatorStyle, resolvedStyle]}
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
      />
    );
  },
);

ProgressIndicator.displayName = 'Progress.Indicator';
