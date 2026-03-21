import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { Slider } from '../index';

describe('Slider keyboard navigation', () => {
  it('supports Arrow keys and Home/End on thumbs', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} max={100} min={0}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowLeft' } });
    expect(thumb.props['aria-valuenow']).toBe(49);

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    expect(thumb.props['aria-valuenow']).toBe(50);

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'Home' } });
    expect(thumb.props['aria-valuenow']).toBe(0);

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'End' } });
    expect(thumb.props['aria-valuenow']).toBe(100);
  });

  it('supports PageUp and PageDown on thumbs', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} largeStep={10} max={100} min={0}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'PageUp' } });
    expect(thumb.props['aria-valuenow']).toBe(60);

    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'PageDown' } });
    expect(thumb.props['aria-valuenow']).toBe(50);
  });

  it('blocks navigation when disabled', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} disabled>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');
    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    expect(thumb.props['aria-valuenow']).toBe(50);
  });

  it('handles hardware accessibility actions', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} onValueChange={onValueChange}>
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Thumb');

    fireEvent(thumb, 'accessibilityAction', {
      nativeEvent: { actionName: 'increment' },
    });
    expect(onValueChange).toHaveBeenCalledWith(51, expect.anything());

    fireEvent(thumb, 'accessibilityAction', {
      nativeEvent: { actionName: 'decrement' },
    });
    expect(onValueChange).toHaveBeenCalledWith(50, expect.anything());
  });

  it('updates correct thumb in multi-thumb configuration', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root defaultValue={[10, 20]} onValueChange={onValueChange}>
        <Slider.Thumb aria-label='T0' index={0} />
        <Slider.Thumb aria-label='T1' index={1} />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('T1'), 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
    });
    expect(onValueChange).toHaveBeenCalledWith([10, 21], expect.anything());

    fireEvent(getByLabelText('T0'), 'keyDown', {
      nativeEvent: { key: 'ArrowLeft' },
    });
    expect(onValueChange).toHaveBeenCalledWith([9, 21], expect.anything());
  });

  it('calls onKeyDown prop on Thumb', () => {
    const onKeyDown = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50}>
        <Slider.Thumb aria-label='Thumb' onKeyDown={onKeyDown} />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('Thumb'), 'keyDown', {
      nativeEvent: { key: 'ArrowRight' },
    });
    expect(onKeyDown).toHaveBeenCalled();
  });
});
