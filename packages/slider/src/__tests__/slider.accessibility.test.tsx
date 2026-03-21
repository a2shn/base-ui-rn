import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Slider } from '../index';

describe('Slider accessibility', () => {
  it('applies adjustable semantics and disabled state', () => {
    const { getByLabelText } = render(
      <Slider.Root disabled>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const root = getByLabelText('Volume thumb');
    testAccessibility(root, {
      disabled: true,
    });
  });

  it('applies range-specific aria attributes to the thumb', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={25} max={50} min={10}>
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Thumb');
    expect(thumb.props['aria-valuemin']).toBe(10);
    expect(thumb.props['aria-valuemax']).toBe(50);
    expect(thumb.props['aria-valuenow']).toBe(25);
    expect(thumb.props['aria-orientation']).toBe('horizontal');
  });

  it('applies orientation to the root and thumb', () => {
    const { getByLabelText } = render(
      <Slider.Root orientation='vertical'>
        <Slider.Thumb aria-label='Vertical thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Vertical thumb');
    expect(thumb.props['aria-orientation']).toBe('vertical');
  });

  it('provides formatted value text', () => {
    const { getByLabelText } = render(
      <Slider.Root
        defaultValue={50}
        format={{ currency: 'USD', style: 'currency' }}
        locale='en-US'
      >
        <Slider.Thumb aria-label='Price thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Price thumb');
    expect(thumb.props['aria-valuetext']).toBe('$50.00');
  });

  it('applies data-attributes to the root', () => {
    const { getByTestId } = render(
      <Slider.Root
        defaultValue={50}
        disabled
        minStepsBetweenValues={5}
        orientation='vertical'
        stepBetweenValues={10}
        testID='root'
      >
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>,
    );

    const root = getByTestId('root');
    expect(root.props['data-orientation']).toBe('vertical');
    expect(root.props['data-disabled']).toBe(true);
    expect(root.props['data-min-steps-between-values']).toBe(5);
    expect(root.props['data-step-between-values']).toBe(10);
  });

  it('applies data-attributes to the thumb', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} disabled>
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Thumb');
    expect(thumb.props['data-orientation']).toBe('horizontal');
    expect(thumb.props['data-disabled']).toBe(true);
  });
});
