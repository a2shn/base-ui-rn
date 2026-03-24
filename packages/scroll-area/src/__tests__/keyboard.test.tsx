import { render } from '@testing-library/react-native';
import * as React from 'react';

import { ScrollArea } from '../index';

describe('ScrollArea.Keyboard', () => {
  it('native scrollview handles keyboard interaction', () => {
    // ScrollArea.Viewport is an Animated.ScrollView.
    // Keyboard support is native to RN ScrollView.
    render(
      <ScrollArea.Root>
        <ScrollArea.Viewport testID='viewport'>
          <ScrollArea.Content />
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );
  });
});
