import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('Slider - Keyboard', () => {
  it('increments value on ArrowRight', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Slider.Root defaultValue={25} step={1} onValueChange={onValueChange}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    fireKeyPress(thumb, 'ArrowRight');
    expect(onValueChange).toHaveBeenCalledWith(26);
  });

  // Since we used fireKeyPress which triggers both keyDown and keyPress
  // and our thumb is bound to both, we should ensure useSliderRoot logic
  // only fires once if possible, but for now we test the outcome.

  it('decrements value on ArrowLeft', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Slider.Root defaultValue={25} step={1} onValueChange={onValueChange}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    fireKeyPress(thumb, 'ArrowLeft');
    expect(onValueChange).toHaveBeenCalledWith(24);
  });

  it('jumps to min on Home', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Slider.Root defaultValue={25} min={0} onValueChange={onValueChange}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    fireKeyPress(thumb, 'Home');
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('jumps to max on End', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Slider.Root defaultValue={25} max={100} onValueChange={onValueChange}>
        <Slider.Thumb />
      </Slider.Root>,
    );

    const thumb = getByRole('slider');
    fireKeyPress(thumb, 'End');
    expect(onValueChange).toHaveBeenCalledWith(100);
  });
});
