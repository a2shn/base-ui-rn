import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Input } from '../input';

describe('Input: Rendering', () => {
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder='Enter your name' />,
    );
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();
  });

  it('renders with defaultValue', () => {
    const { getByDisplayValue } = render(<Input defaultValue='Abdelrahman' />);
    expect(getByDisplayValue('Abdelrahman')).toBeTruthy();
  });

  it('renders with controlled value', () => {
    const { getByDisplayValue } = render(<Input value='Controlled Value' />);
    expect(getByDisplayValue('Controlled Value')).toBeTruthy();
  });
});
