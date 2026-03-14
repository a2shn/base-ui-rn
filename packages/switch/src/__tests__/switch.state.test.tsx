import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SwitchRoot } from '../index';

describe('Switch - State', () => {
  it('toggles uncontrolled state on press', () => {
    const { getByRole } = render(<SwitchRoot defaultChecked={false} />);
    const root = getByRole('switch');

    expect(root.props.accessibilityState.checked).toBe(false);

    fireEvent.press(root);
    expect(root.props.accessibilityState.checked).toBe(true);

    fireEvent.press(root);
    expect(root.props.accessibilityState.checked).toBe(false);
  });

  it('respects controlled checked prop', () => {
    const onCheckedChange = jest.fn();
    const { getByRole, rerender } = render(
      <SwitchRoot checked={true} onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    expect(root.props.accessibilityState.checked).toBe(true);

    fireEvent.press(root);
    expect(onCheckedChange).toHaveBeenCalledWith(false);

    // State should not change until re-rendered with new prop
    expect(root.props.accessibilityState.checked).toBe(true);

    rerender(<SwitchRoot checked={false} onCheckedChange={onCheckedChange} />);
    expect(root.props.accessibilityState.checked).toBe(false);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot disabled onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireEvent.press(root);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root.props.accessibilityState.checked).toBe(false);
  });

  it('does not toggle when readOnly', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot readOnly onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireEvent.press(root);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root.props.accessibilityState.checked).toBe(false);
  });
});
