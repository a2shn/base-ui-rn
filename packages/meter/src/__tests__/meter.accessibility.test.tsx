import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Meter } from '../index';

describe('Meter - Accessibility', () => {
  it('has correct default accessibility traits', () => {
    const { getByRole } = render(
      <Meter.Root value={50}>
        <Meter.Label>Storage</Meter.Label>
      </Meter.Root>,
    );

    const meter = getByRole('progressbar');
    testAccessibility(meter, {
      focusable: false,
      importantForAccessibility: 'yes',
    });

    expect(meter.props.accessibilityValue).toEqual({
      max: 100,
      min: 0,
      now: 50,
      text: '50',
    });
  });

  it('labels the meter using Meter.Label', () => {
    const { getByRole, getByText } = render(
      <Meter.Root value={50}>
        <Meter.Label>Power Level</Meter.Label>
      </Meter.Root>,
    );

    const label = getByText('Power Level');
    const meter = getByRole('progressbar');

    expect(label.props.nativeID).toBeDefined();
    expect(meter.props.accessibilityLabelledBy).toEqual([label.props.nativeID]);
  });

  it('supports custom accessibilityValueText via getAccessibilityValueText', () => {
    const { getByRole } = render(
      <Meter.Root
        getAccessibilityValueText={(formatted) => `${formatted} units used`}
        value={80}
      />,
    );

    const meter = getByRole('progressbar');
    expect(meter.props.accessibilityValue).toEqual({
      max: 100,
      min: 0,
      now: 80,
      text: '80 units used',
    });
  });

  it('prefers accessibilityLabel over automated labeling', () => {
    const { getByRole } = render(
      <Meter.Root
        accessibilityLabel='Custom Label'
        value={50}
      >
        <Meter.Label>Ignored Label</Meter.Label>
      </Meter.Root>,
    );

    const meter = getByRole('progressbar');
    expect(meter.props.accessibilityLabel).toBe('Custom Label');
    expect(meter.props.accessibilityLabelledBy).toBeUndefined();
  });

  it('hides track and value from accessibility tree', () => {
    const { getByTestId } = render(
      <Meter.Root accessibilityLabel='Meter' value={50}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
        <Meter.Value testID='value' />
      </Meter.Root>,
    );

    const track = getByTestId('track', { includeHiddenElements: true });
    const indicator = getByTestId('indicator', {
      includeHiddenElements: true,
    });
    const value = getByTestId('value', { includeHiddenElements: true });

    expect(track.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(track.props.accessibilityElementsHidden).toBe(true);
    expect(indicator.props.importantForAccessibility).toBe(
      'no-hide-descendants',
    );
    expect(indicator.props.accessibilityElementsHidden).toBe(true);
    expect(value.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(value.props.accessibilityElementsHidden).toBe(true);
  });
});
