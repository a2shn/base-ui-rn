import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Separator } from '../separator';

describe('Separator refs', () => {
  it('forwards ref to the underlying View component', () => {
    const ref = React.createRef<View>();
    render(<Separator ref={ref} />);
    expect(ref.current).not.toBeNull();
  });
});
