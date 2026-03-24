import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { Input } from '../input';

describe('Input: State', () => {
  it('tracks focused state', () => {
    const { getByPlaceholderText } = render(<Input placeholder='Input' />);

    const input = getByPlaceholderText('Input');

    expect(input.props['data-focused']).toBe(false);

    fireEvent(input, 'focus');
    expect(input.props['data-focused']).toBe(true);

    fireEvent(input, 'blur');
    expect(input.props['data-focused']).toBe(false);
  });

  it('tracks filled state', () => {
    const { getByPlaceholderText } = render(<Input placeholder='Input' />);

    const input = getByPlaceholderText('Input');

    expect(input.props['data-filled']).toBe(false);

    fireEvent.changeText(input, 'Hello');
    expect(input.props['data-filled']).toBe(true);

    fireEvent.changeText(input, '');
    expect(input.props['data-filled']).toBe(false);
  });

  it('tracks touched state', () => {
    const { getByPlaceholderText } = render(<Input placeholder='Input' />);

    const input = getByPlaceholderText('Input');

    expect(input.props['data-touched']).toBe(false);

    fireEvent(input, 'focus');
    expect(input.props['data-touched']).toBe(false);

    fireEvent(input, 'blur');
    expect(input.props['data-touched']).toBe(true);
  });

  it('tracks dirty state', () => {
    const { getByPlaceholderText } = render(<Input placeholder='Input' />);

    const input = getByPlaceholderText('Input');

    expect(input.props['data-dirty']).toBe(false);

    fireEvent.changeText(input, 'Hello');
    expect(input.props['data-dirty']).toBe(true);
  });
});
