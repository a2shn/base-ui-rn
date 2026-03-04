import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Separator } from '../separator';

describe('Separator', () => {
  it('renders with default horizontal orientation and separator role', () => {
    const { getByTestId } = render(<Separator testID='separator' />);
    const separator = getByTestId('separator');

    expect(separator.props.role).toBe('separator');
    // On web, it should have aria-orientation horizontal
    expect(separator.props['aria-orientation']).toBe('horizontal');
    // And data-orientation for CSS
    expect(separator.props['data-orientation']).toBe('horizontal');
  });

  it('renders with vertical orientation', () => {
    const { getByTestId } = render(
      <Separator testID='separator' orientation='vertical' />,
    );
    const separator = getByTestId('separator');

    expect(separator.props.role).toBe('separator');
    expect(separator.props['aria-orientation']).toBe('vertical');
    expect(separator.props['data-orientation']).toBe('vertical');
  });

  it('is hidden from screen readers when decorative', () => {
    const { UNSAFE_getByType } = render(
      <Separator testID='separator' decorative />,
    );
    const separator = UNSAFE_getByType(View);

    expect(separator.props.role).toBe('presentation');
    expect(separator.props.accessibilityElementsHidden).toBe(true);
    expect(separator.props.importantForAccessibility).toBe(
      'no-hide-descendants',
    );
  });

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
