import { render } from '@testing-library/react-native';
import * as React from 'react';

import { Avatar } from '../index';

describe('Avatar - Rendering', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <Avatar.Root testID='avatar'>
        <Avatar.Image
          source={{ uri: 'https://example.com/image.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(getByTestId('avatar')).toBeDefined();
  });
});
