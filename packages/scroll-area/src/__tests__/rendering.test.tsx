import { render } from '@testing-library/react-native';
import * as React from 'react';

import { ScrollArea } from '../index';

describe('ScrollArea.Rendering', () => {
  it('renders all components without crashing', () => {
    const { getByTestId } = render(
      <ScrollArea.Root testID='root'>
        <ScrollArea.Viewport testID='viewport'>
          <ScrollArea.Content testID='content'>
            <div style={{ height: 1000, width: 1000 }} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation='vertical' testID='scrollbar-v'>
          <ScrollArea.Thumb testID='thumb-v' />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation='horizontal' testID='scrollbar-h'>
          <ScrollArea.Thumb testID='thumb-h' />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner testID='corner' />
      </ScrollArea.Root>,
    );

    expect(getByTestId('root')).toBeTruthy();
    expect(getByTestId('viewport')).toBeTruthy();
    expect(getByTestId('content')).toBeTruthy();
  });
});
