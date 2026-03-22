import { render } from '@testing-library/react-native';
import * as React from 'react';

import { SliderContext } from '../context';
import { Slider } from '../index';

describe('Slider performance', () => {
  it('measures context value stability', () => {
    let contextUpdates = 0;
    let lastContext: unknown = null;

    const ContextTracker = () => {
      const context = React.useContext(SliderContext);
      React.useEffect(() => {
        if (lastContext && context !== lastContext) {
          contextUpdates++;
        }
        lastContext = context;
      });
      return null;
    };

    const { rerender } = render(
      <Slider.Root defaultValue={50}>
        <ContextTracker />
      </Slider.Root>,
    );

    // Rerender with same props
    rerender(
      <Slider.Root defaultValue={50}>
        <ContextTracker />
      </Slider.Root>,
    );

    // Currently, context updates because useSlider return is not memoized
    // eslint-disable-next-line no-console
    console.log(`Context updates on same-prop rerender: ${contextUpdates}`);
  });

  it('measures Intl.NumberFormat instantiation', () => {
    const spy = jest.spyOn(Intl, 'NumberFormat');

    render(
      <Slider.Root defaultValue={[10, 20, 30]} format={{ style: 'decimal' }}>
        <Slider.Thumb aria-label='T0' index={0} />
        <Slider.Thumb aria-label='T1' index={1} />
        <Slider.Thumb aria-label='T2' index={2} />
        <Slider.Value />
      </Slider.Root>,
    );

    // Expected baseline: 4 (3 thumbs + 1 value)
    // eslint-disable-next-line no-console
    console.log(`Intl.NumberFormat calls: ${spy.mock.calls.length}`);
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(1);

    spy.mockRestore();
  });
});
