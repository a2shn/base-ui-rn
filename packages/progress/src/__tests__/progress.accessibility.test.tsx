import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';

import { Progress } from '../index';

describe('Progress - Accessibility', () => {
  it('has correct default accessibility traits', () => {
    const { getByRole } = render(
      <Progress.Root value={50} >
        <Progress.Label>Loading</Progress.Label>
      </Progress.Root>,
    );

    const progress = getByRole('progressbar');
    testAccessibility(progress, {
      focusable: false,
      importantForAccessibility: 'yes',
    });

    expect(progress.props.accessibilityValue).toEqual({
      max: 100,
      min: 0,
      now: 50,
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
    expect(progress.props.accessibilityLabelledBy).toEqual([
      label.props.nativeID,
    ]);
  });

  it('supports custom accessibilityValueText via getAccessibilityValueText', () => {
    const { getByRole } = render(
      <Progress.Root
        getAccessibilityValueText={(formatted) => `${formatted}% done`}
        value={80}
      />,
    );

    const progress = getByRole('progressbar');
    expect(progress.props.accessibilityValue).toEqual({
      max: 100,
      min: 0,
      now: 80,
      text: '80% done',
    });
  });
});
