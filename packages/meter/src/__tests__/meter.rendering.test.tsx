import { render } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

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
      <Meter.Root style={{ margin: 10 }} value={50} />,
    );
    const meter = getByRole('progressbar');
    expect(StyleSheet.flatten(meter.props.style).margin).toBe(10);
  });

  it('supports custom min and max values', () => {
    const { getByTestId } = render(
      <Meter.Root max={500} min={100} value={200}>
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
          <Meter.Indicator style={{ height: 10 }} testID='indicator' />
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
      <Meter.Root max={500} min={0} value={600}>
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
      <Meter.Root max={500} min={0} value={-100}>
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
        format={{ style: 'percent' }}
        locale='en-US'
        max={1}
        min={0}
        value={0.75}
      >
        <Meter.Value />
      </Meter.Root>,
    );

    expect(getByText('75%', { includeHiddenElements: true })).toBeDefined();
  });

  it('supports custom render function for Meter.Value', () => {
    const { getByText } = render(
      <Meter.Root max={100} value={24}>
        <Meter.Value>
          {(state) =>
            `Value is ${state.value} (formatted: ${state.formattedValue})`
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
