import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Meter } from '../meter';
import { testAccessibility } from '@base-ui-rn/test-utils';

describe('Meter', () => {
  describe('Rendering', () => {
    it('renders correctly with default values', () => {
      const { getByRole, getByTestId } = render(
        <Meter.Root value={50}>
          <Meter.Track>
            <Meter.Indicator testID='indicator' />
          </Meter.Track>
        </Meter.Root>,
      );

      const meter = getByRole('progressbar');
      expect(meter).toBeDefined();

      const indicator = getByTestId('indicator', {
        includeHiddenElements: true,
      });
      expect(StyleSheet.flatten(indicator.props.style).width).toBe('50%');
    });

    it('supports custom min and max values', () => {
      const { getByTestId } = render(
        <Meter.Root value={200} min={100} max={500}>
          <Meter.Track>
            <Meter.Indicator testID='indicator' />
          </Meter.Track>
        </Meter.Root>,
      );

      const indicator = getByTestId('indicator', {
        includeHiddenElements: true,
      });
      // (200 - 100) / (500 - 100) = 100 / 400 = 25%
      expect(StyleSheet.flatten(indicator.props.style).width).toBe('25%');
    });

    it('clamps values within min and max range', () => {
      const { getByTestId, rerender } = render(
        <Meter.Root value={600} min={0} max={500}>
          <Meter.Track>
            <Meter.Indicator testID='indicator' />
          </Meter.Track>
        </Meter.Root>,
      );

      let indicator = getByTestId('indicator', {
        includeHiddenElements: true,
      });
      expect(StyleSheet.flatten(indicator.props.style).width).toBe('100%');

      rerender(
        <Meter.Root value={-100} min={0} max={500}>
          <Meter.Track>
            <Meter.Indicator testID='indicator' />
          </Meter.Track>
        </Meter.Root>,
      );
      indicator = getByTestId('indicator', { includeHiddenElements: true });
      expect(StyleSheet.flatten(indicator.props.style).width).toBe('0%');
    });

    it('supports localized value formatting', () => {
      const { getByText } = render(
        <Meter.Root
          value={0.75}
          min={0}
          max={1}
          format={{ style: 'percent' }}
          locale='en-US'
        >
          <Meter.Value />
        </Meter.Root>,
      );

      expect(getByText('75%', { includeHiddenElements: true })).toBeDefined();
    });

    it('supports custom render function for Meter.Value', () => {
      const { getByText } = render(
        <Meter.Root value={24} max={100}>
          <Meter.Value>
            {(formattedValue, value) =>
              `Value is ${value} (formatted: ${formattedValue})`
            }
          </Meter.Value>
        </Meter.Root>,
      );

      expect(
        getByText('Value is 24 (formatted: 24)', {
          includeHiddenElements: true,
        }),
      ).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('has correct default accessibility traits', () => {
      const { getByRole } = render(
        <Meter.Root value={50}>
          <Meter.Label>Storage</Meter.Label>
        </Meter.Root>,
      );

      const meter = getByRole('progressbar');
      testAccessibility(meter, {
        focusable: false, // Root is not focusable by default unless tabIndex is set for web
        importantForAccessibility: 'yes',
      });

      expect(meter.props.accessibilityValue).toMatchObject({
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
      expect(meter.props.accessibilityLabelledBy).toEqual([
        label.props.nativeID,
      ]);
    });

    it('supports custom ariaValueText via getAriaValueText', () => {
      const { getByRole } = render(
        <Meter.Root
          value={80}
          getAriaValueText={(value) => `${value} units used`}
        />,
      );

      const meter = getByRole('progressbar');
      expect(meter.props.accessibilityValue.text).toBe('80 units used');
    });

    it('supports custom aria-valuetext prop', () => {
      const { getByRole } = render(
        <Meter.Root value={50} aria-valuetext='Halfway' />,
      );

      const meter = getByRole('progressbar');
      expect(meter.props.accessibilityValue.text).toBe('Halfway');
    });

    it('prefers accessibilityLabel over automated labeling', () => {
      const { getByRole } = render(
        <Meter.Root
          value={50}
          accessibilityLabel='Custom Label'
          accessibilityHint='Custom Hint'
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
        <Meter.Root value={50} accessibilityHint='Displays storage usage'>
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
  });

  describe('Ref', () => {
    it('forwards refs correctly', () => {
      const rootRef = React.createRef<View>();
      const labelRef = React.createRef<Text>();
      const trackRef = React.createRef<View>();
      const indicatorRef = React.createRef<View>();
      const valueRef = React.createRef<Text>();

      render(
        <Meter.Root value={50} ref={rootRef}>
          <Meter.Label ref={labelRef}>L</Meter.Label>
          <Meter.Track ref={trackRef}>
            <Meter.Indicator ref={indicatorRef} />
          </Meter.Track>
          <Meter.Value ref={valueRef} />
        </Meter.Root>,
      );

      expect(rootRef.current).toBeDefined();
      expect(labelRef.current).toBeDefined();
      expect(trackRef.current).toBeDefined();
      expect(indicatorRef.current).toBeDefined();
      expect(valueRef.current).toBeDefined();
    });
  });

  describe('Web Accessibility', () => {
    it('sets web-specific ARIA attributes', () => {
      const { getByRole } = render(<Meter.Root value={50} min={10} max={90} />);

      const meter = getByRole('progressbar');
      expect(meter.props['aria-valuemin']).toBe(10);
      expect(meter.props['aria-valuemax']).toBe(90);
      expect(meter.props['aria-valuenow']).toBe(50);
    });

    it('supports tabIndex on Root', () => {
      const { getByRole } = render(<Meter.Root value={50} tabIndex={0} />);

      const meter = getByRole('progressbar');
      expect(meter.props.tabIndex).toBe(0);
    });
  });
});
