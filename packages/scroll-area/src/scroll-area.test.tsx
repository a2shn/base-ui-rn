import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { ScrollArea } from './index';

describe('ScrollArea', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Context', () => {
    it('renders the complete scroll area structure without crashing', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='always' testID='scroll-root'>
          <ScrollArea.Viewport testID='scroll-viewport'>
            <ScrollArea.Content testID='scroll-content'>
              <Text>Content</Text>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            keepMounted
            orientation='vertical'
            testID='scrollbar-y'
          >
            <ScrollArea.Thumb testID='thumb-y' />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner testID='corner' />
        </ScrollArea.Root>,
      );

      expect(screen.getByTestId('scroll-root')).toBeTruthy();
      expect(screen.getByTestId('scroll-viewport')).toBeTruthy();
      expect(screen.getByTestId('scroll-content')).toBeTruthy();
      expect(screen.getByTestId('scrollbar-y')).toBeTruthy();
    });

    it('throws an error if sub-components are rendered outside of Root', () => {
      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => render(<ScrollArea.Viewport />)).toThrow(
        'ScrollArea components must be used within a ScrollArea.Root',
      );

      consoleErrorMock.mockRestore();
    });
  });

  describe('Layout & Overflow Detection', () => {
    it('detects vertical overflow and mounts scrollbar when content exceeds viewport', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='always'>
          <ScrollArea.Viewport testID='viewport'>
            <ScrollArea.Content testID='content' />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation='vertical' testID='scrollbar-y' />
        </ScrollArea.Root>,
      );

      // Initially, no overflow, so the scrollbar should not render
      expect(screen.queryByTestId('scrollbar-y')).toBeNull();

      // Trigger Viewport layout
      fireEvent(screen.getByTestId('viewport'), 'layout', {
        nativeEvent: { layout: { height: 200, width: 200 } },
      });

      // Trigger Content layout (taller than viewport)
      fireEvent(screen.getByTestId('content'), 'layout', {
        nativeEvent: { layout: { height: 500, width: 200 } },
      });

      // Scrollbar should now be visible
      expect(screen.getByTestId('scrollbar-y')).toBeTruthy();
    });

    it('detects horizontal overflow and mounts scrollbar when content exceeds viewport', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='always'>
          <ScrollArea.Viewport testID='viewport'>
            <ScrollArea.Content testID='content' />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation='horizontal' testID='scrollbar-x' />
        </ScrollArea.Root>,
      );

      // Initially, no overflow
      expect(screen.queryByTestId('scrollbar-x')).toBeNull();

      fireEvent(screen.getByTestId('viewport'), 'layout', {
        nativeEvent: { layout: { height: 200, width: 200 } },
      });
      // Content wider than viewport
      fireEvent(screen.getByTestId('content'), 'layout', {
        nativeEvent: { layout: { height: 200, width: 500 } },
      });

      // Scrollbar should now be visible
      expect(screen.getByTestId('scrollbar-x')).toBeTruthy();
    });
  });

  describe('Scrollbar Visibility Logic', () => {
    it('hides scrollbar by default if no overflow and visibility is auto', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='auto'>
          <ScrollArea.Scrollbar orientation='vertical' testID='scrollbar'>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>,
      );

      expect(screen.queryByTestId('scrollbar')).toBeNull();
    });

    it('keeps scrollbar mounted if keepMounted is true regardless of overflow', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='auto'>
          <ScrollArea.Scrollbar
            keepMounted
            orientation='vertical'
            testID='scrollbar'
          >
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>,
      );

      expect(screen.getByTestId('scrollbar')).toBeTruthy();
    });
  });

  describe('Keyboard & Interaction Handlers', () => {
    it('attaches hover handlers and updates hovering state', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='hover' testID='root'>
          <ScrollArea.Viewport testID='viewport'>
            <ScrollArea.Content testID='content' />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation='vertical' testID='scrollbar' />
        </ScrollArea.Root>,
      );

      // Trigger overflow to enable rendering
      fireEvent(screen.getByTestId('viewport'), 'layout', {
        nativeEvent: { layout: { height: 200, width: 200 } },
      });
      fireEvent(screen.getByTestId('content'), 'layout', {
        nativeEvent: { layout: { height: 500, width: 200 } },
      });

      // Not hovering yet
      expect(screen.queryByTestId('scrollbar')).toBeNull();

      fireEvent(screen.getByTestId('root'), 'pointerEnter');

      // Now hovering
      expect(screen.getByTestId('scrollbar')).toBeTruthy();
    });
  });

  describe('Viewport Scrolling', () => {
    it('sets isScrolling to true when a scroll begins', () => {
      render(
        <ScrollArea.Root scrollbarVisibility='scroll'>
          <ScrollArea.Viewport testID='viewport'>
            <ScrollArea.Content testID='content' />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation='vertical' testID='scrollbar' />
        </ScrollArea.Root>,
      );

      // Trigger overflow
      fireEvent(screen.getByTestId('viewport'), 'layout', {
        nativeEvent: { layout: { height: 200, width: 200 } },
      });
      fireEvent(screen.getByTestId('content'), 'layout', {
        nativeEvent: { layout: { height: 500, width: 200 } },
      });

      // Not scrolling yet
      expect(screen.queryByTestId('scrollbar')).toBeNull();

      // Trigger Scroll
      fireEvent(screen.getByTestId('viewport'), 'momentumScrollBegin');

      // Now scrolling
      expect(screen.getByTestId('scrollbar')).toBeTruthy();
    });
  });
});
