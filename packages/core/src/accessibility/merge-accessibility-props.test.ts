import {
  mergeAccessibilityActions,
  mergeAccessibilityState,
} from './merge-accessibility-props';

describe('mergeAccessibilityActions', () => {
  it('combines unique actions', () => {
    const internal = [{ name: 'activate' }];
    const external = [{ name: 'magicTap' }];
    expect(mergeAccessibilityActions(internal, external)).toEqual([
      { name: 'activate' },
      { name: 'magicTap' },
    ]);
  });

  it('prioritizes external actions on name conflict', () => {
    const internal = [{ label: 'Internal', name: 'activate' }];
    const external = [{ label: 'External', name: 'activate' }];
    expect(mergeAccessibilityActions(internal, external)).toEqual([
      { label: 'External', name: 'activate' },
    ]);
  });

  it('handles missing internal or external actions', () => {
    const actions = [{ name: 'activate' }];
    expect(mergeAccessibilityActions(actions, undefined)).toEqual(actions);
    expect(mergeAccessibilityActions(undefined, actions)).toEqual(actions);
    expect(mergeAccessibilityActions(undefined, undefined)).toEqual([]);
  });
});

describe('mergeAccessibilityState', () => {
  it('merges states with external overriding internal', () => {
    const internal = { checked: true, disabled: false };
    const external = { disabled: true, expanded: false };
    expect(mergeAccessibilityState(internal, external)).toEqual({
      checked: true,
      disabled: true,
      expanded: false,
    });
  });
});
