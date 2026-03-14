import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { SwitchRoot, SwitchThumb } from '../index';

describe('Switch - Ref Forwarding', () => {
  it('forwards ref to SwitchRoot', () => {
    const ref = React.createRef<View>();
    render(<SwitchRoot ref={ref} />);
    expect(ref.current).toBeDefined();
  });

  it('forwards ref to SwitchThumb', () => {
    const ref = React.createRef<View>();
    render(
      <SwitchRoot>
        <SwitchThumb ref={ref} />
      </SwitchRoot>,
    );
    expect(ref.current).toBeDefined();
  });
});
