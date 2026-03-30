import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Progress } from '../index';

describe('Progress - Rendering & State', () => {
  it('handles indeterminate state', () => {
    const { getByRole } = render(
      <Progress.Root value={null}>
        <Progress.Label>Loading</Progress.Label>
      </Progress.Root>,
    );

    const progress = getByRole('progressbar');
    expect(progress.props.accessibilityValue).toEqual({
      max: undefined,
      min: undefined,
      now: undefined,
      text: undefined,
    });
  });

  it('applies indicator style based on state', () => {
    const { getByTestId, rerender } = render(
      <Progress.Root testID='root' value={50}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    const indicator = getByTestId('indicator', { includeHiddenElements: true });
    expect(indicator.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '50%' })]),
    );

    rerender(
      <Progress.Root testID='root' value={100}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    expect(indicator.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '100%' })]),
    );

    rerender(
      <Progress.Root testID='root' value={null}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    // For indeterminate, width should not be a percentage string from calculation
    expect(indicator.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '0%' })]),
    );
  });

  it('supports style and children as functions', () => {
    const { getByText } = render(
      <Progress.Root value={50}>
        {(state) => <Progress.Label>{state.value}%</Progress.Label>}
      </Progress.Root>,
    );

    expect(getByText('50%')).toBeDefined();
  });
});
