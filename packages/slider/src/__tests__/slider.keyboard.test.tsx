import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider keyboard', () => {
  it('increments on ArrowRight/ArrowUp keys', () => {
    const { getByLabelText, getByText } = render(
      <Slider.Root defaultValue={1}>
        <Slider.Value />
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');
    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    fireEvent(thumb, 'keyDown', { nativeEvent: { key: 'ArrowUp' } });

    expect(getByText('3')).toBeTruthy();
  });
});
