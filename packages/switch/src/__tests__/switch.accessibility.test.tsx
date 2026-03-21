import { testAccessibility } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { SwitchRoot, SwitchThumb } from '../index';

describe('Switch - Accessibility', () => {
  it('has correct default accessibility attributes', () => {
    const { getByRole } = render(<SwitchRoot />);
    const root = getByRole('switch');

    testAccessibility(root, {
      checked: false,
      disabled: false,
    });

    expect(root.props['data-checked']).toBeUndefined();
    expect(root.props['data-disabled']).toBeUndefined();
  });

  it('has correct attributes when checked', () => {
    const { getByRole, getByTestId } = render(
      <SwitchRoot checked>
        <SwitchThumb testID='thumb' />
      </SwitchRoot>,
    );
    const root = getByRole('switch');
    const thumb = getByTestId('thumb');

    testAccessibility(root, {
      checked: true,
    });
    expect(root.props['data-checked']).toBe('true');
    expect(thumb.props['data-checked']).toBe('true');
  });

  it('has correct attributes when disabled', () => {
    const { getByRole, getByTestId } = render(
      <SwitchRoot disabled>
        <SwitchThumb testID='thumb' />
      </SwitchRoot>,
    );
    const root = getByRole('switch');
    const thumb = getByTestId('thumb');

    testAccessibility(root, {
      disabled: true,
    });
    expect(root.props['data-disabled']).toBe('true');
    expect(thumb.props['data-disabled']).toBe('true');
  });

  it('has correct attributes when readOnly', () => {
    const { getByRole } = render(<SwitchRoot readOnly />);
    const root = getByRole('switch');

    expect(root.props['aria-readonly']).toBe(true);
  });
});
