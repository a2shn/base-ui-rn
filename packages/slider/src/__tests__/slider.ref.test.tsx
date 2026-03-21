import * as React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Slider } from '../index';

describe('Slider refs', () => {
  it('forwards refs for all sub-components', () => {
    const rootRef = React.createRef<View>();
    const labelRef = React.createRef<Text>();
    const valueRef = React.createRef<Text>();
    const trackRef = React.createRef<View>();
    const indicatorRef = React.createRef<View>();
    const thumbRef = React.createRef<View>();

    render(
      <Slider.Root ref={rootRef} defaultValue={42}>
        <Slider.Label ref={labelRef}>Label</Slider.Label>
        <Slider.Value ref={valueRef} />
        <Slider.Track ref={trackRef}>
          <Slider.Indicator ref={indicatorRef} />
          <Slider.Thumb ref={thumbRef} aria-label='Thumb' />
        </Slider.Track>
      </Slider.Root>,
    );

    expect(rootRef.current).toBeTruthy();
    expect(labelRef.current).toBeTruthy();
    expect(valueRef.current).toBeTruthy();
    expect(trackRef.current).toBeTruthy();
    expect(indicatorRef.current).toBeTruthy();
    expect(thumbRef.current).toBeTruthy();
  });
});
