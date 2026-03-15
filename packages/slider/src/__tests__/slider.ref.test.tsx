import * as React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Slider } from '../index';

describe('Slider refs', () => {
  it('forwards refs for root and value', () => {
    const rootRef = React.createRef<View>();
    const valueRef = React.createRef<Text>();

    render(
      <Slider.Root ref={rootRef} defaultValue={42}>
        <Slider.Value ref={valueRef} />
        <Slider.Thumb aria-label='Volume thumb' />
      </Slider.Root>,
    );

    expect(rootRef.current).toBeTruthy();
    expect(valueRef.current).toBeTruthy();
  });
});
