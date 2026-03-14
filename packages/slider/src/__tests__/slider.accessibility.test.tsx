import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';
import { testAccessibility } from '@base-ui-rn/test-utils';

describe('Slider - Accessibility', () => {
  it('sets correct accessibility attributes on Thumb', () => {
    const { getByRole } = render(
      <Slider.Root value={25} min={0} max={100}>
        <Slider.Thumb aria-label='Volume' />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    testAccessibility(thumb, {
      label: 'Volume',
      disabled: false,
      checked: undefined,
    });

    expect(thumb.props['aria-valuemin']).toBe(0);
    expect(thumb.props['aria-valuemax']).toBe(100);
    expect(thumb.props['aria-valuenow']).toBe(25);
  });

  it('sets correct accessibility orientation', () => {
    const { getByRole } = render(
      <Slider.Root defaultValue={25} orientation='vertical'>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    expect(thumb.props['data-orientation']).toBe('vertical');
  });

  it('sets accessibility disabled state', () => {
    const { getByRole } = render(
      <Slider.Root defaultValue={25} disabled>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    testAccessibility(thumb, {
      disabled: true,
    });
  });
});
