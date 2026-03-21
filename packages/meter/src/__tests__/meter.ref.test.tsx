import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Meter } from '../index';

describe('Meter - Ref', () => {
  it('forwards refs correctly', () => {
    const rootRef = React.createRef<View>();
    const labelRef = React.createRef<Text>();
    const trackRef = React.createRef<View>();
    const indicatorRef = React.createRef<View>();
    const valueRef = React.createRef<Text>();

    render(
      <Meter.Root ref={rootRef} value={50}>
        <Meter.Label ref={labelRef}>L</Meter.Label>
        <Meter.Track ref={trackRef}>
          <Meter.Indicator ref={indicatorRef} />
        </Meter.Track>
        <Meter.Value ref={valueRef} />
      </Meter.Root>,
    );

    expect(rootRef.current).toBeDefined();
    expect(labelRef.current).toBeDefined();
    expect(trackRef.current).toBeDefined();
    expect(indicatorRef.current).toBeDefined();
    expect(valueRef.current).toBeDefined();
  });
});
