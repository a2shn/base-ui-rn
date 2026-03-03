import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { type ToggleGroupState } from '../types';
import { Toggle } from '@base-ui-rn/toggle';

describe('ToggleGroup - Orientation & Focus Props', () => {
  it('exposes orientation and loopFocus in style function state', () => {
    let capturedState: ToggleGroupState | undefined;
    render(
      <ToggleGroup
        orientation='vertical'
        loopFocus={false}
        style={(state) => {
          capturedState = state;
          return {};
        }}
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(capturedState?.orientation).toBe('vertical');
    expect(capturedState?.loopFocus).toBe(false);
  });

  it('exposes orientation and loopFocus in children function state', () => {
    let capturedState: ToggleGroupState | undefined;
    render(
      <ToggleGroup orientation='vertical' loopFocus={false}>
        {(state) => {
          capturedState = state;
          return <Text>Child</Text>;
        }}
      </ToggleGroup>,
    );

    expect(capturedState?.orientation).toBe('vertical');
    expect(capturedState?.loopFocus).toBe(false);
  });

  it('defaults to horizontal orientation and loopFocus true', () => {
    let capturedState: ToggleGroupState | undefined;
    render(
      <ToggleGroup
        style={(state) => {
          capturedState = state;
          return {};
        }}
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(capturedState?.orientation).toBe('horizontal');
    expect(capturedState?.loopFocus).toBe(true);
  });
});
