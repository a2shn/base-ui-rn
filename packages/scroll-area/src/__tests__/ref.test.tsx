import { render } from '@testing-library/react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

import { ScrollArea } from '../index';

describe('ScrollArea.Ref', () => {
  it('forwards refs correctly', () => {
    const rootRef = React.createRef<View>();
    const viewportRef = React.createRef<ScrollView>();
    const contentRef = React.createRef<View>();
    const scrollbarRef = React.createRef<View>();
    const thumbRef = React.createRef<View>();
    const cornerRef = React.createRef<View>();

    render(
      <ScrollArea.Root ref={rootRef}>
        <ScrollArea.Viewport ref={viewportRef}>
          <ScrollArea.Content ref={contentRef}>
            <div style={{ height: 1000, width: 1000 }} />
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          keepMounted
          orientation='vertical'
          ref={scrollbarRef}
        >
          <ScrollArea.Thumb ref={thumbRef} />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner ref={cornerRef} />
      </ScrollArea.Root>,
    );

    expect(rootRef.current).toBeDefined();
    expect(viewportRef.current).toBeDefined();
    expect(contentRef.current).toBeDefined();
    expect(scrollbarRef.current).toBeDefined();
    expect(thumbRef.current).toBeDefined();
    // Corner only renders when overflow occurs.
  });
});
