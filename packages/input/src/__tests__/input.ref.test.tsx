import { render } from '@testing-library/react-native';
import * as React from 'react';
import type { TextInput } from 'react-native';

import { Input } from '../input';

describe('Input: Ref', () => {
  it('forwards ref correctly', () => {
    const ref = React.createRef<TextInput>();
    render(<Input ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
