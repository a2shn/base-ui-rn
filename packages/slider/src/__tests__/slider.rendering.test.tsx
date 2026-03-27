import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Slider } from '../index';

describe('Slider rendering', () => {
  it('renders root and all basic parts', () => {
    const { getAllByRole, getByTestId, getByText } = render(
      <Slider.Root defaultValue={25} testID='root'>
        <Slider.Label>Volume</Slider.Label>
        <Slider.Value />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator testID='indicator' />
            <Slider.Thumb aria-label='Volume thumb' testID='thumb' />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );

    const root = getByTestId('root');
    const thumb = getByTestId('thumb', { includeHiddenElements: true });

    expect(root.props.role).toBe('adjustable');
    expect(thumb.props.role).toBe('adjustable');
    expect(
      getAllByRole('adjustable', { includeHiddenElements: true }),
    ).toHaveLength(2);
    expect(getByText('Volume')).toBeTruthy();
    expect(getByText('25')).toBeTruthy();
    expect(
      getByTestId('indicator', { includeHiddenElements: true }),
    ).toBeTruthy();
  });

  it('renders Slider.Value with multiple thumbs', () => {
    const { getByText } = render(
      <Slider.Root defaultValue={[10, 50, 90]}>
        <Slider.Value>{(formatted) => formatted.join(' - ')}</Slider.Value>
        <Slider.Thumb aria-label='T1' index={0} />
        <Slider.Thumb aria-label='T2' index={1} />
        <Slider.Thumb aria-label='T3' index={2} />
      </Slider.Root>,
    );

    expect(getByText('10 - 50 - 90')).toBeTruthy();
  });

  it('applies custom style functions based on state', () => {
    const { getByTestId } = render(
      <Slider.Root
        defaultValue={50}
        style={(state) => ({
          backgroundColor: state.disabled ? 'grey' : 'blue',
        })}
        testID='root'
      >
        <Slider.Thumb aria-label='Thumb' />
      </Slider.Root>,
    );

    const root = getByTestId('root');
    expect(root.props.style.backgroundColor).toBe('blue');
  });
});
