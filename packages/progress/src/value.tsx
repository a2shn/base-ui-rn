import * as React from 'react';
import { Text } from 'react-native';

import { useProgressContext } from './progress-context';
import type { ProgressValueProps } from './types';

/**
 * A text element displaying the current value of the progress.
 *
 * Hidden from accessibility to avoid redundant announcements.
 *
 * @example
 * ```tsx
 * <Progress.Value />
 * ```
 */
export const ProgressValue = React.memo(
  React.forwardRef<Text, ProgressValueProps>((props, ref) => {
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
      style,
      ...other
    } = props;
    const {
      formattedValue,
      isComplete,
      isIndeterminate,
      isProgressing,
      value,
    } = useProgressContext();

    const resolvedStyle =
      typeof style === 'function' ? style(formattedValue, value) : style;

    return (
      <Text
        {...other}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? true}
        aria-labelledby={ariaLabelledBy}
        importantForAccessibility='no-hide-descendants'
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
        {typeof children === 'function'
          ? children(formattedValue, value)
          : formattedValue}
      </Text>
    );
  }),
);

ProgressValue.displayName = 'Progress.Value';
