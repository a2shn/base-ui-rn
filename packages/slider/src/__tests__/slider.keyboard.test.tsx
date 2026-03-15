import * as React from 'react';
import { render } from '@testing-library/react-native';
import { fireKeyPress } from '@base-ui-rn/test-utils';
import { Slider } from '../index';

describe('Slider keyboard', () => {
  it('increments on Enter/Space activation keys', () => {
    const { getByLabelText, getByText } = render(
      <Slider.Root defaultValue={1}>
        <Slider.Value />
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    const thumb = getByLabelText('Volume thumb');
    fireKeyPress(thumb, 'Enter');
    fireKeyPress(thumb, ' ');

    expect(getByText('3')).toBeTruthy();
  });
});
