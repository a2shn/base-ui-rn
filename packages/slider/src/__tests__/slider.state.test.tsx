import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider state', () => {
  it('supports uncontrolled updates via keyboard', () => {
    const { getByLabelText, getByText } = render(
      <Slider.Root defaultValue={10}>
        <Slider.Value />
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('Volume thumb'), 'keyPress', {
      nativeEvent: { key: 'Enter' },
    });

    expect(getByText('11')).toBeTruthy();
  });

  it('supports controlled value', () => {
    const onValueChange = jest.fn();
    const { getByLabelText } = render(
      <Slider.Root value={20} onValueChange={onValueChange}>
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    fireEvent(getByLabelText('Volume thumb'), 'keyPress', {
      nativeEvent: { key: 'Enter' },
    });

    expect(onValueChange).toHaveBeenCalledWith(21);
  });
});
