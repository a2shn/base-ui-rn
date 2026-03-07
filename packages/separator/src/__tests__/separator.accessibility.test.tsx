import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Separator } from '../separator';

describe('Separator - Accessibility', () => {
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
});
