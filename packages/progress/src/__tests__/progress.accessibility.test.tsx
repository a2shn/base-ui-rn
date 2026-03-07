import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Progress } from '../progress';
import { testAccessibility } from '@base-ui-rn/test-utils';

describe('Progress - Accessibility', () => {
  it('has correct default accessibility traits', () => {
    const { getByRole } = render(
      <Progress.Root value={50}>
        <Progress.Label>Loading</Progress.Label>
      </Progress.Root>,
    );

    const progress = getByRole('progressbar');
    testAccessibility(progress, {
      focusable: false,
      importantForAccessibility: 'yes',
    });

    expect(progress.props.accessibilityValue).toEqual({
      text: '50',
    });
  });

  it('labels the progress using Progress.Label', () => {
    const { getByRole, getByText } = render(
      <Progress.Root value={50}>
        <Progress.Label>Downloading...</Progress.Label>
      </Progress.Root>,
    );

    const label = getByText('Downloading...');
    const progress = getByRole('progressbar');

    expect(label.props.nativeID).toBeDefined();
    expect(progress.props['aria-labelledby']).toBe(label.props.nativeID);
  });

  it('supports custom ariaValueText via getAriaValueText', () => {
    const { getByRole } = render(
      <Progress.Root
        value={80}
        getAriaValueText={(formatted) => `${formatted}% done`}
      />,
    );

    const progress = getByRole('progressbar');
    expect(progress.props.accessibilityValue).toEqual({
      text: '80% done',
    });
  });
});
