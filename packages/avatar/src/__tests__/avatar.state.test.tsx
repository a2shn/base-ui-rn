import { act, render } from '@testing-library/react-native';
import * as React from 'react';

import { Avatar } from '../index';

jest.useFakeTimers();

describe('Avatar - State', () => {
  it('shows fallback when image fails to load', async () => {
    const { getByTestId } = render(
      <Avatar.Root>
        <Avatar.Image
          source={{ uri: 'https://example.com/invalid.png' }}
          testID='image'
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
          source={{ uri: 'https://example.com/image.png' }}
          testID='image'
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
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/image.png' }}
          testID='image'
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

  it('does not regress to loading after image has failed for the same source', () => {
    const onLoadingStatusChange = jest.fn();
    const { getByTestId } = render(
      <Avatar.Root>
        <Avatar.Image
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/invalid.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');

    act(() => {
      image.props.onError();
    });

    expect(onLoadingStatusChange).toHaveBeenCalledWith('error');
    onLoadingStatusChange.mockClear();

    act(() => {
      image.props.onLoadStart();
    });

    expect(onLoadingStatusChange).not.toHaveBeenCalledWith('loading');
  });

  it('keeps loaded state when rerendered with equivalent uri source object', () => {
    const onLoadingStatusChange = jest.fn();
    const { getByTestId, queryByTestId, rerender } = render(
      <Avatar.Root>
        <Avatar.Image
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/image.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');

    act(() => {
      image.props.onLoad();
    });

    rerender(
      <Avatar.Root>
        <Avatar.Image
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/image.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const rerenderedImage = getByTestId('image');

    act(() => {
      rerenderedImage.props.onLoadStart();
    });

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loaded');
    expect(onLoadingStatusChange).not.toHaveBeenCalledWith('loading');
    expect(queryByTestId('fallback')).toBeNull();
  });

  it('enters loading state when source changes before effects flush', () => {
    const onLoadingStatusChange = jest.fn();
    const { getByTestId, queryByTestId, rerender } = render(
      <Avatar.Root>
        <Avatar.Image
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/first.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const image = getByTestId('image');

    act(() => {
      image.props.onLoad();
    });

    onLoadingStatusChange.mockClear();

    rerender(
      <Avatar.Root>
        <Avatar.Image
          onLoadingStatusChange={onLoadingStatusChange}
          source={{ uri: 'https://example.com/second.png' }}
          testID='image'
        />
        <Avatar.Fallback testID='fallback'>FB</Avatar.Fallback>
      </Avatar.Root>,
    );

    const rerenderedImage = getByTestId('image');

    act(() => {
      rerenderedImage.props.onLoadStart();
    });

    expect(onLoadingStatusChange).toHaveBeenCalledWith('loading');
    expect(queryByTestId('fallback')).toBeDefined();
  });

  it('respects the delay prop on fallback', () => {
    const { queryByTestId } = render(
      <Avatar.Root>
        <Avatar.Image source={{ uri: 'https://example.com/slow-image.png' }} />
        <Avatar.Fallback delay={500} testID='fallback'>
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
