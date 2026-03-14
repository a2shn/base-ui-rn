import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider - Rendering', () => {
  it('renders correctly with single value', () => {
    const { getByRole } = render(
      <Slider.Root defaultValue={25}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );

    expect(getByRole('slider')).toBeDefined();
  });

  it('renders correctly with multiple thumbs', () => {
    const { getAllByRole } = render(
      <Slider.Root defaultValue={[25, 75]}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb index={0} />
            <Slider.Thumb index={1} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );

    expect(getAllByRole('slider')).toHaveLength(2);
  });

  it('renders label and value', () => {
    const { getByText } = render(
      <Slider.Root defaultValue={50}>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
      </Slider.Root>,
    );

    expect(getByText('Volume')).toBeDefined();
    expect(getByText('50')).toBeDefined();
  });
});
