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

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'Home' } });
    expect(thumb.props['aria-valuenow']).toBe(0);

    fireEvent(thumb, 'keyPress', { nativeEvent: { key: 'End' } });
    expect(thumb.props['aria-valuenow']).toBe(100);
  });
});
