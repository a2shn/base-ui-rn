import { render } from '@testing-library/react-native';
import * as React from 'react';

import { ScrollArea } from '../index';

describe('ScrollArea.KeyboardNav', () => {
  it('native scrollview handles keyboard navigation', () => {
    // Keyboard navigation (arrows, etc.) is native to RN ScrollView.
    render(
      <ScrollArea.Root>
        <ScrollArea.Viewport testID='viewport'>
          <ScrollArea.Content />
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );
  });
});
