import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider rendering', () => {
  it('renders root and all basic parts', () => {
    const { getAllByRole, getByText } = render(
      <Slider.Root defaultValue={25}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator testID='indicator' />
            <Slider.Thumb aria-label='Volume thumb' />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );

    expect(getAllByRole('adjustable')).toHaveLength(2);
    expect(getByText('Volume')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
  });
});
