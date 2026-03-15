import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider rendering', () => {
  it('renders root and all basic parts', () => {
    const { getAllByRole, getByText, getByTestId } = render(
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

    expect(getAllByRole('adjustable')).toHaveLength(2); // One for Root, one for Thumb
    expect(getByText('Volume')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
    expect(getByTestId('indicator')).toBeTruthy();
  });

  it('renders Slider.Value with multiple thumbs', () => {
    const { getByText } = render(
      <Slider.Root defaultValue={[10, 50, 90]}>
        <Slider.Value>
          {(formatted) => formatted.join(' - ')}
        </Slider.Value>
        <Slider.Thumb index={0} aria-label='T1' />
        <Slider.Thumb index={1} aria-label='T2' />
        <Slider.Thumb index={2} aria-label='T3' />
      </Slider.Root>,
    );

    expect(getByText('10 - 50 - 90')).toBeTruthy();
  });

  it('applies custom style functions based on state', () => {
    const { getByTestId } = render(
      <Slider.Root 
        defaultValue={50}
        style={(state) => ({ backgroundColor: state.disabled ? 'grey' : 'blue' })}
        testID='root'
      >
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>
    );

    const root = getByTestId('root');
    expect(root.props.style.backgroundColor).toBe('blue');
  });
});
