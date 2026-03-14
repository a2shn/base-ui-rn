import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider - State', () => {
  it('respects min and max constraints', () => {
    const { getByRole } = render(
      <Slider.Root value={50} min={0} max={100}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    expect(thumb.props['aria-valuemin']).toBe(0);
    expect(thumb.props['aria-valuemax']).toBe(100);
    expect(thumb.props['aria-valuenow']).toBe(50);
  });

  it('handles controlled state', () => {
    const { getByRole, rerender } = render(
      <Slider.Root value={30}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    expect(getByRole('slider').props['aria-valuenow']).toBe(30);

    rerender(
      <Slider.Root value={60}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    expect(getByRole('slider').props['aria-valuenow']).toBe(60);
  });
});
