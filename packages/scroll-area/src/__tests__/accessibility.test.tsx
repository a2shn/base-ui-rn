import { render } from '@testing-library/react-native';
import * as React from 'react';

import { ScrollArea } from '../index';

describe('ScrollArea.Accessibility', () => {
  it('applies correct accessibility roles and attributes', () => {
    const { getByTestId } = render(
      <ScrollArea.Root aria-label='Scroll Area' testID='root'>
        <ScrollArea.Viewport testID='viewport'>
          <ScrollArea.Content>
            <div style={{ height: 1000, width: 1000 }} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          keepMounted
          orientation='vertical'
          testID='scrollbar'
        >
          <ScrollArea.Thumb testID='thumb' />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    const root = getByTestId('root');
    const scrollbar = getByTestId('scrollbar');

    expect(root.props['aria-label']).toBe('Scroll Area');
    expect(scrollbar.props.role).toBe('scrollbar');
    expect(scrollbar.props['aria-orientation']).toBe('vertical');
  });
});
