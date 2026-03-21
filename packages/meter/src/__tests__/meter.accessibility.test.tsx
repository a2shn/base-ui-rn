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
    expect(meter.props['aria-labelledby']).toBe(label.props.nativeID);
    // For Android
    expect(meter.props.accessibilityLabelledBy).toEqual([label.props.nativeID]);
  });

  it('supports custom ariaValueText via getAriaValueText', () => {
    const { getByRole } = render(
      <Meter.Root
        getAriaValueText={(value) => `${value} units used`}
        value={80}
      />,
    );

    const meter = getByRole('progressbar');
    expect(meter.props.accessibilityValue).toEqual({
      text: '80 units used',
    });
  });

  it('supports custom aria-valuetext prop', () => {
    const { getByRole } = render(
      <Meter.Root aria-valuetext='Halfway' value={50} />,
    );

    const meter = getByRole('progressbar');
    expect(meter.props.accessibilityValue).toEqual({
      text: 'Halfway',
    });
  });

  it('prefers accessibilityLabel over automated labeling', () => {
    const { getByRole } = render(
      <Meter.Root
        accessibilityHint='Custom Hint'
        accessibilityLabel='Custom Label'
        value={50}
      >
        <Meter.Label>Ignored Label</Meter.Label>
      </Meter.Root>,
    );

    const meter = getByRole('progressbar');
    expect(meter.props.accessibilityLabel).toBe('Custom Label');
    expect(meter.props['aria-labelledby']).toBeUndefined();
    expect(meter.props.accessibilityLabelledBy).toBeUndefined();
  });

  it('hides track and value from accessibility tree', () => {
    const { getByTestId } = render(
      <Meter.Root accessibilityHint='Displays storage usage' value={50}>
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
    expect(track.props['aria-hidden']).toBe(true);
    expect(indicator.props.importantForAccessibility).toBe(
      'no-hide-descendants',
    );
    expect(indicator.props['aria-hidden']).toBe(true);
    expect(value.props.importantForAccessibility).toBe('no-hide-descendants');
    expect(value.props['aria-hidden']).toBe(true);
  });

  describe('Web Accessibility', () => {
    it('sets web-specific ARIA attributes', () => {
      const { getByRole } = render(<Meter.Root max={90} min={10} value={50} />);

      const meter = getByRole('progressbar');
      expect(meter.props['aria-valuemin']).toBe(10);
      expect(meter.props['aria-valuemax']).toBe(90);
      expect(meter.props['aria-valuenow']).toBe(50);
    });

    it('supports tabIndex on Root', () => {
      const { getByRole } = render(<Meter.Root tabIndex={0} value={50} />);

      const meter = getByRole('progressbar');
      expect(meter.props.tabIndex).toBe(0);
    });
  });

  it('supports accessible prop', () => {
    const { getByTestId } = render(
      <Meter.Root accessible={false} testID='meter' value={50} />,
    );
    const meter = getByTestId('meter');
    expect(meter.props.accessible).toBe(false);
  });
});
