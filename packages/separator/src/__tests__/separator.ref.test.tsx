import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Separator } from '../separator';

describe('Separator - Ref & Props', () => {
  it('forwards ref to the underlying View', () => {
    const ref = React.createRef<View>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeDefined();
  });

  it('forwards other View props', () => {
    const { getByTestId } = render(
      <Separator
        testID='separator'
        style={{ height: 1 }}
        pointerEvents='none'
      />,
    );
    const separator = getByTestId('separator');

    expect(separator.props.style).toEqual({ height: 1 });
    expect(separator.props.pointerEvents).toBe('none');
  });
});
