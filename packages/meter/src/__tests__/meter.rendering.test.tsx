import * as React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';
import { Meter } from '../index';

describe('Meter - Rendering', () => {
  it('renders correctly with default values', () => {
    const { getByRole, getByTestId, getByText } = render(
      <Meter.Root value={50}>
        <Meter.Track>
          <Meter.Indicator testID='indicator' />
        </Meter.Track>
        <Meter.Value />
      </Meter.Root>,
    );

    const meter = getByRole('progressbar');
    expect(meter).toBeDefined();

    const indicator = getByTestId('indicator', {
      includeHiddenElements: true,
    });
    expect(StyleSheet.flatten(indicator.props.style).width).toBe('50%');

    const value = getByText('50', { includeHiddenElements: true });
    expect(value).toBeDefined();
  });

  it('passes through style to Meter.Root', () => {
    const { getByRole } = render(
      <Meter.Root value={50} style={{ margin: 10 }} />,
    );
    const meter = getByRole('progressbar');
    expect(StyleSheet.flatten(meter.props.style).margin).toBe(10);
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

  it('merges custom styles with Meter.Indicator computed style', () => {
    const { getByTestId } = render(
      <Meter.Root value={50}>
        <Meter.Track>
          <Meter.Indicator testID='indicator' style={{ height: 10 }} />
        </Meter.Track>
      </Meter.Root>,
    );

    const indicator = getByTestId('indicator', {
      includeHiddenElements: true,
    });
    const style = StyleSheet.flatten(indicator.props.style);
    expect(style.width).toBe('50%');
    expect(style.height).toBe(10);
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
