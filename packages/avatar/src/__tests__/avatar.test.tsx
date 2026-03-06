import * as React from 'react';
import { render, act } from '@testing-library/react-native';
import { Avatar } from '../avatar';

jest.useFakeTimers();

describe('Avatar', () => {
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

  it('shows fallback when image fails to load', async () => {
    const { getByTestId } = render(
      <Avatar.Root>
        <Avatar.Image
          testID='image'
          source={{ uri: 'https://example.com/invalid.png' }}
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');
    act(() => {
      image.props.onError();
    });

    expect(getByTestId('fallback')).toBeDefined();
  });

  it('hides fallback when image loads successfully', () => {
    const { getByTestId, queryByTestId } = render(
      <Avatar.Root>
        <Avatar.Image
          testID='image'
          source={{ uri: 'https://example.com/image.png' }}
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');
    act(() => {
      image.props.onLoad();
    });

    expect(queryByTestId('fallback')).toBeNull();
  });


  it('does not regress to loading after image has loaded for the same source', () => {
    const onLoadingStatusChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Avatar.Root>
        <Avatar.Image
          testID='image'
          source={{ uri: 'https://example.com/image.png' }}
          onLoadingStatusChange={onLoadingStatusChange}
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');

    act(() => {
      image.props.onLoad();
    });

    expect(queryByTestId('fallback')).toBeNull();

    act(() => {
      image.props.onLoadStart();
    });

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loaded');
    expect(onLoadingStatusChange).not.toHaveBeenCalledWith('loading');
    expect(queryByTestId('fallback')).toBeNull();
  });

  it('respects the delay prop on fallback', () => {
    const { queryByTestId } = render(
      <Avatar.Root>
        <Avatar.Image source={{ uri: 'https://example.com/slow-image.png' }} />
        <Avatar.Fallback testID='fallback' delay={500}>
          FB
        </Avatar.Fallback>
      </Avatar.Root>,
    );

    // Should not show immediately
    expect(queryByTestId('fallback')).toBeNull();

    // Advance timers by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(queryByTestId('fallback')).toBeDefined();
  });
});
