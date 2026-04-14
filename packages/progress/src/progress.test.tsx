import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { Progress } from './index';

describe('Progress', () => {
  describe('Logic & State', () => {
    it('calculates percentage correctly for standard ranges', () => {
      render(
        <Progress.Root max={100} min={0} value={50}>
          <Progress.Indicator testID='indicator' />
        </Progress.Root>,
      );

      const indicator = screen.getByTestId('indicator', {
        includeHiddenElements: true,
      });
      expect(StyleSheet.flatten(indicator.props.style)).toMatchObject({
        width: '50%',
      });
    });

    it('handles custom ranges (e.g., 200 to 400)', () => {
      render(
        <Progress.Root max={400} min={200} value={300}>
          <Progress.Indicator testID='indicator' />
        </Progress.Root>,
      );

      const indicator = screen.getByTestId('indicator', {
        includeHiddenElements: true,
      });
      expect(StyleSheet.flatten(indicator.props.style)).toMatchObject({
        width: '50%',
      });
    });

    it('clamps percentage between 0 and 100', () => {
      const { rerender } = render(
        <Progress.Root max={100} min={0} value={150}>
          <Progress.Indicator testID='indicator' />
        </Progress.Root>,
      );

      expect(
        StyleSheet.flatten(
          screen.getByTestId('indicator', { includeHiddenElements: true }).props
            .style,
        ),
      ).toMatchObject({ width: '100%' });

      rerender(
        <Progress.Root max={100} min={0} value={-50}>
          <Progress.Indicator testID='indicator' />
        </Progress.Root>,
      );

      expect(
        StyleSheet.flatten(
          screen.getByTestId('indicator', { includeHiddenElements: true }).props
            .style,
        ),
      ).toMatchObject({ width: '0%' });
    });

    it('handles indeterminate state (value=null)', () => {
      render(
        <Progress.Root value={null}>
          <Progress.Indicator testID='indicator' />
          <Progress.Value testID='value' />
        </Progress.Root>,
      );

      const indicator = screen.getByTestId('indicator', {
        includeHiddenElements: true,
      });
      const valueText = screen.getByTestId('value', {
        includeHiddenElements: true,
      });

      const style = StyleSheet.flatten(indicator.props.style);
      expect(style.width).toBeUndefined();
      expect(valueText.props.children).toBeNull();
    });

    it('handles edge case: min equals max', () => {
      render(
        <Progress.Root max={100} min={100} value={100}>
          <Progress.Indicator testID='indicator' />
        </Progress.Root>,
      );

      const indicator = screen.getByTestId('indicator', {
        includeHiddenElements: true,
      });
      expect(StyleSheet.flatten(indicator.props.style)).toMatchObject({
        width: '100%',
      });
    });
  });

  describe('Accessibility (A11y)', () => {
    it('sets correct accessibility properties on the root', () => {
      render(
        <Progress.Root max={100} min={0} testID='root' value={30}>
          <Text>Loading</Text>
        </Progress.Root>,
      );

      const root = screen.getByTestId('root');

      expect(root.props.role).toBe('progressbar');
      expect(root.props.accessibilityValue).toMatchObject({
        max: 100,
        min: 0,
        now: 30,
        text: '30',
      });
    });

    it('links Label and Root via accessibilityLabelledBy', () => {
      render(
        <Progress.Root testID='root' value={50}>
          <Text testID='label'>Downloading...</Text>
        </Progress.Root>,
      );

      const root = screen.getByTestId('root');
      const label = screen.getByTestId('label');

      // Native commonly uses accessibilityLabelledBy as an array of IDs
      const labelledBy =
        root.props.accessibilityLabelledBy || root.props['aria-labelledby'];
      const labelId = label.props.nativeID;

      if (Array.isArray(labelledBy)) {
        expect(labelledBy).toContain(labelId);
      } else {
        expect(labelledBy).toBe(labelId);
      }
    });

    it('supports custom accessibility value text via getAccessibilityValueText', () => {
      render(
        <Progress.Root
          getAccessibilityValueText={(formatted) =>
            `${formatted} out of 10 steps`
          }
          max={10}
          testID='root'
          value={2}
        />,
      );

      const root = screen.getByTestId('root');
      expect(root.props.accessibilityValue.text).toBe('2 out of 10 steps');
    });

    it('hides visual-only components from screen readers', () => {
      render(
        <Progress.Root value={50}>
          <Progress.Track testID='track'>
            <Progress.Indicator testID='indicator' />
          </Progress.Track>
          <Progress.Value testID='value' />
        </Progress.Root>,
      );

      expect(
        screen.getByTestId('track', { includeHiddenElements: true }).props
          .accessibilityElementsHidden,
      ).toBe(true);
      expect(
        screen.getByTestId('indicator', { includeHiddenElements: true }).props
          .accessibilityElementsHidden,
      ).toBe(true);
      expect(
        screen.getByTestId('value', { includeHiddenElements: true }).props
          .accessibilityElementsHidden,
      ).toBe(true);
    });
  });

  describe('Formatting', () => {
    it('respects locale and format options', () => {
      render(
        <Progress.Root
          format={{ style: 'percent' }}
          locale='en-US'
          max={1}
          min={0}
          value={0.75}
        >
          <Progress.Value testID='value' />
        </Progress.Root>,
      );

      const valueNode = screen.getByTestId('value', {
        includeHiddenElements: true,
      });
      expect(valueNode.props.children).toBe('75%');
    });
  });

  describe('Extensibility & Styles', () => {
    it('supports functional styles based on state', () => {
      render(
        <Progress.Root
          max={100}
          style={({ max, value }) => ({
            backgroundColor: value === max ? 'green' : 'red',
          })}
          testID='root'
          value={100}
        />,
      );

      const root = screen.getByTestId('root');
      expect(StyleSheet.flatten(root.props.style)).toMatchObject({
        backgroundColor: 'green',
      });
    });

    it('throws error when sub-components are used outside Root', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<Progress.Indicator />)).toThrow(
        /Progress components must be rendered within a Progress.Root component./,
      );

      spy.mockRestore();
    });
  });
});
