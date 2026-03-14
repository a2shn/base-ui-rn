import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Slider } from '../index';

describe('Slider - Ref Forwarding', () => {
  it('forwards ref to SliderRoot', () => {
    const ref = React.createRef<View>();
    render(<Slider.Root ref={ref} />);
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to SliderControl', () => {
    const ref = React.createRef<View>();
    render(
      <Slider.Root>
        <Slider.Control ref={ref} />
      </Slider.Root>,
    );
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to SliderTrack', () => {
    const ref = React.createRef<View>();
    render(
      <Slider.Root>
        <Slider.Control>
          <Slider.Track ref={ref} />
        </Slider.Control>
      </Slider.Root>,
    );
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to SliderThumb', () => {
    const ref = React.createRef<View>();
    render(
      <Slider.Root>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb ref={ref} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    expect(ref.current).toBeDefined();
  });
});
