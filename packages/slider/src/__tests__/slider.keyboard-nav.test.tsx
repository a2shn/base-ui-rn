import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider keyboard navigation', () => {
  it('supports Arrow keys and Home/End on thumbs', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} min={0} max={100}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'ArrowLeft' } });
    expect(thumb.props['aria-valuenow']).toBe(49);

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    expect(thumb.props['aria-valuenow']).toBe(50);

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'Home' } });
    expect(thumb.props['aria-valuenow']).toBe(0);

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'End' } });
    expect(thumb.props['aria-valuenow']).toBe(100);
  });

  it('supports PageUp and PageDown on thumbs', () => {
    const { getByLabelText } = render(
      <Slider.Root defaultValue={50} min={0} max={100} largeStep={10}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'PageUp' } });
    expect(thumb.props['aria-valuenow']).toBe(60);

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'PageDown' } });
    expect(thumb.props['aria-valuenow']).toBe(50);
  });

  it('blocks navigation when disabled', () => {
     const { getByLabelText } = render(
      <Slider.Root defaultValue={50} disabled>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');
    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'ArrowRight' } });
    expect(thumb.props['aria-valuenow']).toBe(50);
  });
});
