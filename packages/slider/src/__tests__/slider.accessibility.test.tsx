import * as React from 'react';
import { render } from '@testing-library/react-native';
import { testAccessibility } from '@base-ui-rn/test-utils';
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
      <Slider.Root min={10} max={50} defaultValue={25}>
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
      <Slider.Root defaultValue={50} locale='en-US' format={{ style: 'currency', currency: 'USD' }}>
        <Slider.Thumb aria-label='Price thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Price thumb');
    expect(thumb.props['aria-valuetext']).toBe('$50.00');
  });
});
