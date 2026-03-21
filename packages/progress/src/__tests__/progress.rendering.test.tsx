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
    expect(progress.props.accessibilityValue).toBeUndefined();
    expect(progress.props['data-indeterminate']).toBeDefined();
    expect(progress.props['data-complete']).toBeUndefined();
    expect(progress.props['data-progressing']).toBeUndefined();
  });

  it('applies data attributes correctly based on state', () => {
    const { getByTestId, rerender } = render(
      <Progress.Root testID='root' value={50}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    let root = getByTestId('root');
    const indicator = getByTestId('indicator', { includeHiddenElements: true });

    expect(root.props['data-progressing']).toBeDefined();
    expect(root.props['data-complete']).toBeUndefined();
    expect(indicator.props['data-progressing']).toBeDefined();

    rerender(
      <Progress.Root testID='root' value={100}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    root = getByTestId('root');
    expect(root.props['data-complete']).toBeDefined();
    expect(root.props['data-progressing']).toBeUndefined();

    rerender(
      <Progress.Root testID='root' value={null}>
        <Progress.Indicator testID='indicator' />
      </Progress.Root>,
    );

    root = getByTestId('root');
    expect(root.props['data-indeterminate']).toBeDefined();
    expect(root.props['data-progressing']).toBeUndefined();
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
