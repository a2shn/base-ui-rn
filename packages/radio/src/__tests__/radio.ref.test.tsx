import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Radio, RadioGroup, RadioGroup as RadioGroupNamed } from '../index';

describe('Radio - Ref Forwarding', () => {
  it('forwards ref to RadioGroup', () => {
    const ref = React.createRef<View>();
    render(
      <RadioGroupNamed aria-label='Group' ref={ref}>
        <Radio.Root aria-label='A' value='a' />
      </RadioGroupNamed>,
    );
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to Radio.Root', () => {
    const ref = React.createRef<View>();
    render(
      <RadioGroup aria-label='Group'>
        <Radio.Root aria-label='A' ref={ref} value='a' />
      </RadioGroup>,
    );
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to Radio.Indicator', () => {
    const ref = React.createRef<View>();
    render(
      <RadioGroup defaultValue='a'>
        <Radio.Root aria-label='A' value='a'>
          <Radio.Indicator ref={ref} />
        </Radio.Root>
      </RadioGroup>,
    );
    expect(ref.current).toBeDefined();
  });
});
