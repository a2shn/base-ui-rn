import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Avatar } from './index';

describe('Avatar Primitive (Integration)', () => {
  describe('Basic Rendering & Lifecycle', () => {
    it('renders fallback initially while image is loading', () => {
      render(
        <Avatar.Root testID='root'>
          <Avatar.Image
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
          <Avatar.Fallback testID='fallback'>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      const fallback = screen.getByTestId('fallback', {
        includeHiddenElements: true,
      });

      expect(fallback).toBeTruthy();
      expect(
        screen.getByText('JD', { includeHiddenElements: true }),
      ).toBeTruthy();
    });

    it('unmounts fallback when image loads successfully', async () => {
      const onLoadingStatusChangeMock = jest.fn();

      render(
        <Avatar.Root testID='root'>
          <Avatar.Image
            onLoadingStatusChange={onLoadingStatusChangeMock}
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
          <Avatar.Fallback testID='fallback'>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      act(() => {
        fireEvent(screen.getByTestId('image'), 'load');
      });

      expect(screen.queryByTestId('fallback')).toBeNull();
      expect(onLoadingStatusChangeMock).toHaveBeenCalledWith('loaded');
    });

    it('keeps fallback rendered when image errors', () => {
      const onLoadingStatusChangeMock = jest.fn();

      render(
        <Avatar.Root testID='root'>
          <Avatar.Image
            onLoadingStatusChange={onLoadingStatusChangeMock}
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
          <Avatar.Fallback testID='fallback'>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      act(() => {
        fireEvent(screen.getByTestId('image'), 'error');
      });

      const fallback = screen.getByTestId('fallback');
      expect(fallback).toBeTruthy();
      expect(onLoadingStatusChangeMock).toHaveBeenCalledWith('error');
    });
  });

  describe('Fallback Delay', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays rendering the fallback until the timer expires', async () => {
      render(
        <Avatar.Root testID='root'>
          <Avatar.Image
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
          <Avatar.Fallback delay={500} testID='fallback'>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      expect(screen.queryByTestId('fallback')).toBeNull();

      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(screen.queryByTestId('fallback')).toBeNull();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('fallback', { includeHiddenElements: true }),
        ).toBeTruthy();
      });
    });
  });

  describe('Accessibility (A11y)', () => {
    it('applies correct ARIA properties to the root based on loading state', () => {
      render(
        <Avatar.Root accessibilityLabel='User Avatar' testID='root'>
          <Avatar.Image
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
        </Avatar.Root>,
      );

      // The internal useEffect instantly fires 'loading' upon mount
      expect(screen.getByTestId('root').props.accessibilityState).toEqual(
        expect.objectContaining({ busy: true }),
      );

      act(() => {
        fireEvent(screen.getByTestId('image'), 'load');
      });

      expect(screen.getByTestId('root').props.accessibilityState).toEqual(
        expect.objectContaining({ busy: false }),
      );
    });

    it('hides the fallback from screen readers while the image is actively loading', () => {
      render(
        <Avatar.Root testID='root'>
          <Avatar.Image
            source={{ uri: 'https://example.com/avatar.jpg' }}
            testID='image'
          />
          <Avatar.Fallback testID='fallback'>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      expect(
        screen.getByTestId('fallback', { includeHiddenElements: true }).props
          .accessibilityElementsHidden,
      ).toBe(true);
      expect(
        screen.getByTestId('fallback', { includeHiddenElements: true }).props
          .importantForAccessibility,
      ).toBe('no-hide-descendants');

      act(() => {
        fireEvent(screen.getByTestId('image'), 'error');
      });

      expect(
        screen.getByTestId('fallback', { includeHiddenElements: true }).props
          .accessibilityElementsHidden,
      ).toBe(false);
      expect(
        screen.getByTestId('fallback', { includeHiddenElements: true }).props
          .importantForAccessibility,
      ).toBe('yes');
    });
  });

  describe('Extensibility', () => {
    it('successfully forwards a ref to the underlying View', () => {
      const ref = React.createRef<View>();

      render(
        <Avatar.Root ref={ref} testID='ref-root'>
          <Avatar.Fallback>
            <Text>JD</Text>
          </Avatar.Fallback>
        </Avatar.Root>,
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current).toHaveProperty('measure');
    });
  });
});
