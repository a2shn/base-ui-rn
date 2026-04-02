import { render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { Meter } from './index';

describe('Meter', () => {
  it('calculates percentage correctly across various ranges and clamps values', () => {
    const { rerender } = render(
      <Meter.Root testID='root' value={50}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
      </Meter.Root>,
    );

    expect(
      screen.getByTestId('indicator', { includeHiddenElements: true }).props
        .style,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '50%' })]),
    );

    rerender(
      <Meter.Root max={200} min={100} testID='root' value={125}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(
      screen.getByTestId('indicator', { includeHiddenElements: true }).props
        .style,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '25%' })]),
    );

    rerender(
      <Meter.Root max={100} min={0} testID='root' value={150}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(
      screen.getByTestId('indicator', { includeHiddenElements: true }).props
        .style,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '100%' })]),
    );

    rerender(
      <Meter.Root max={100} min={0} testID='root' value={-50}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(
      screen.getByTestId('indicator', { includeHiddenElements: true }).props
        .style,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '0%' })]),
    );

    rerender(
      <Meter.Root max={50} min={50} testID='root' value={100}>
        <Meter.Track testID='track'>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
      </Meter.Root>,
    );
    expect(
      screen.getByTestId('indicator', { includeHiddenElements: true }).props
        .style,
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ width: '100%' })]),
    );
  });

  it('evaluates status based on low and high thresholds', () => {
    const { rerender } = render(
      <Meter.Root high={80} low={20} testID='root' value={10}>
        {(state) => <Text testID='status'>{state.status}</Text>}
      </Meter.Root>,
    );
    expect(screen.getByTestId('status').props.children).toBe('low');

    rerender(
      <Meter.Root high={80} low={20} testID='root' value={50}>
        {(state) => <Text testID='status'>{state.status}</Text>}
      </Meter.Root>,
    );
    expect(screen.getByTestId('status').props.children).toBe('optimum');

    rerender(
      <Meter.Root high={80} low={20} testID='root' value={90}>
        {(state) => <Text testID='status'>{state.status}</Text>}
      </Meter.Root>,
    );
    expect(screen.getByTestId('status').props.children).toBe('high');
  });

  it('applies accessibility properties and formatting correctly', () => {
    render(
      <Meter.Root
        format={{ currency: 'USD', style: 'currency' }}
        getAccessibilityValueText={(formatted, val) =>
          `${val} bucks (${formatted})`
        }
        locale='en-US'
        max={1000}
        min={0}
        testID='root'
        value={250}
      >
        <Meter.Label testID='label'>Budget</Meter.Label>
        <Meter.Value testID='value' />
      </Meter.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.props.role).toBe('progressbar');
    expect(root.props.accessibilityValue).toEqual(
      expect.objectContaining({
        max: 1000,
        min: 0,
        now: 250,
        text: '250 bucks ($250.00)',
      }),
    );

    const label = screen.getByTestId('label');
    expect(root.props.accessibilityLabelledBy).toEqual([label.props.nativeID]);

    const valueNode = screen.getByTestId('value', {
      includeHiddenElements: true,
    });
    expect(valueNode.props.children).toBe('$250.00');
  });

  it('provides dynamic state to functional styles and children', () => {
    render(
      <Meter.Root testID='root' value={75}>
        <Meter.Track
          style={(state) => ({ opacity: state.percentage === 75 ? 1 : 0 })}
          testID='track'
        >
          <Meter.Indicator
            style={(state) => ({
              backgroundColor: state.status === 'optimum' ? 'green' : 'red',
            })}
            testID='indicator'
          />
        </Meter.Track>
        <Meter.Value testID='value'>
          {(state) => `Current: ${state.value}`}
        </Meter.Value>
      </Meter.Root>,
    );

    const track = screen.getByTestId('track', { includeHiddenElements: true });

    expect(StyleSheet.flatten(track.props.style)).toEqual(
      expect.objectContaining({ opacity: 1 }),
    );

    const indicator = screen.getByTestId('indicator', {
      includeHiddenElements: true,
    });
    expect(StyleSheet.flatten(indicator.props.style)).toEqual(
      expect.objectContaining({ backgroundColor: 'green' }),
    );

    const valueNode = screen.getByTestId('value', {
      includeHiddenElements: true,
    });
    expect(valueNode.props.children).toBe('Current: 75');
  });

  it('merges external accessibility properties via useA11y', () => {
    render(
      <Meter.Root
        accessibilityLiveRegion='assertive'
        accessibilityState={{ busy: true }}
        testID='root'
        value={40}
      />,
    );

    const root = screen.getByTestId('root');
    expect(root.props.accessibilityLiveRegion).toBe('assertive');
    expect(root.props.accessibilityState).toEqual(
      expect.objectContaining({ busy: true }),
    );
    expect(root.props.role).toBe('progressbar');
  });
});
