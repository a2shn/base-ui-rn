import * as React from 'react';
import { render } from '@testing-library/react-native';
import { SwitchRoot } from '../index';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('Switch - Keyboard', () => {
  it('toggles on Enter key press', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'Enter');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Space key press', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot defaultChecked={true} onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, ' ');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('does not toggle on other keys', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'a');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot disabled onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'Enter');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
