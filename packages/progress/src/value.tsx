import * as React from 'react';
import { Text } from 'react-native';
import type { ProgressValueProps } from './types';
import { useProgressContext } from './progress-context';

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
    const {
      value,
      formattedValue,
      isComplete,
      isIndeterminate,
      isProgressing,
    } = useProgressContext();

    const resolvedStyle =
      typeof style === 'function' ? style(formattedValue, value) : style;

    return (
      <Text
        {...other}
        ref={ref}
        style={resolvedStyle}
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
        {typeof children === 'function'
          ? children(formattedValue, value)
          : formattedValue}
      </Text>
    );
  },
);

ProgressValue.displayName = 'Progress.Value';
