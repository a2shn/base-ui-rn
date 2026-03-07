import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Avatar } from '../avatar';

describe('Avatar - Rendering', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Avatar.Root testID='avatar'>
        <Avatar.Image
          testID='image'
          source={{ uri: 'https://example.com/image.png' }}
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(getByTestId('avatar')).toBeDefined();
  });
});
