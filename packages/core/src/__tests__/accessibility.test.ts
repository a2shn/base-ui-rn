import {
  isActivationAction,
  mergeAccessibilityActions,
  mergeAccessibilityState,
  resolveAriaDisabled,
  resolveAriaPressed,
  resolveDataPressed,
  resolveTabIndex,
} from '../accessibility';

describe('mergeAccessibilityActions', () => {
  it('should add activate action if not present', () => {
    const actions = [{ label: 'Long Press', name: 'longpress' }];
    const result = mergeAccessibilityActions(actions);
    expect(result).toEqual([
      { label: 'Long Press', name: 'longpress' },
      { name: 'activate' },
    ]);
  });

  it('should not add activate action if already present', () => {
    const actions = [{ label: 'Activate', name: 'activate' }];
    const result = mergeAccessibilityActions(actions);
    expect(result).toEqual([{ label: 'Activate', name: 'activate' }]);
  });

  it('should handle undefined actions gracefully', () => {
    const result = mergeAccessibilityActions(undefined);
    expect(result).toEqual([{ name: 'activate' }]);
  });

  it('should handle empty actions array', () => {
    const result = mergeAccessibilityActions([]);
    expect(result).toEqual([{ name: 'activate' }]);
  });
});

describe('isActivationAction', () => {
  it('should return true for activate', () => {
    expect(isActivationAction('activate')).toBe(true);
  });

  it('should return true for click', () => {
    expect(isActivationAction('click')).toBe(true);
  });

  it('should return true for magicTap', () => {
    expect(isActivationAction('magicTap')).toBe(true);
  });

  it('should return false for other actions', () => {
    expect(isActivationAction('longpress')).toBe(false);
    expect(isActivationAction('scrollToTop')).toBe(false);
  });
});

describe('mergeAccessibilityState', () => {
  it('should merge accessibility state with disabled and no checked', () => {
    const baseState = { label: 'Test', role: 'button' };
    const result = mergeAccessibilityState(baseState, true);
    expect(result).toEqual({ disabled: true, label: 'Test', role: 'button' });
  });

  it('should merge accessibility state with disabled and checked', () => {
    const baseState = { label: 'Toggle' };
    const result = mergeAccessibilityState(baseState, false, true);
    expect(result).toEqual({ checked: true, disabled: false, label: 'Toggle' });
  });

  it('should merge accessibility state with disabled and mixed checked', () => {
    const baseState = {};
    const result = mergeAccessibilityState(baseState, false, 'mixed');
    expect(result).toEqual({ checked: 'mixed', disabled: false });
  });

  it('should handle undefined base accessibility state', () => {
    const result = mergeAccessibilityState(undefined, false);
    expect(result).toEqual({ disabled: false });
  });
});

describe('resolveTabIndex', () => {
  it('should return 0 if focusable and no provided tabIndex', () => {
    expect(resolveTabIndex(true, undefined)).toBe(0);
  });

  it('should return -1 if not focusable and no provided tabIndex', () => {
    expect(resolveTabIndex(false, undefined)).toBe(-1);
  });

  it('should use provided tabIndex (0)', () => {
    expect(resolveTabIndex(true, 0)).toBe(0);
    expect(resolveTabIndex(false, 0)).toBe(0);
  });

  it('should use provided tabIndex (-1)', () => {
    expect(resolveTabIndex(true, -1)).toBe(-1);
    expect(resolveTabIndex(false, -1)).toBe(-1);
  });
});

describe('resolveAriaDisabled', () => {
  it('should return provided aria-disabled if present', () => {
    expect(resolveAriaDisabled(true, false)).toBe(false);
    expect(resolveAriaDisabled(false, true)).toBe(true);
  });

  it('should return disabled state if no provided aria-disabled', () => {
    expect(resolveAriaDisabled(true, undefined)).toBe(true);
    expect(resolveAriaDisabled(false, undefined)).toBe(false);
  });
});

describe('resolveAriaPressed', () => {
  it('should return provided aria-pressed if present', () => {
    expect(resolveAriaPressed(true, false)).toBe(false);
    expect(resolveAriaPressed(false, true)).toBe(true);
    expect(resolveAriaPressed(false, 'mixed')).toBe('mixed');
  });

  it('should return pressed state if no provided aria-pressed', () => {
    expect(resolveAriaPressed(true, undefined)).toBe(true);
    expect(resolveAriaPressed(false, undefined)).toBe(false);
  });
});

describe('resolveDataPressed', () => {
  it('should return provided data-pressed if present', () => {
    expect(resolveDataPressed(true, false)).toBe(false);
    expect(resolveDataPressed(false, true)).toBe(true);
  });

  it('should return pressed state if no provided data-pressed', () => {
    expect(resolveDataPressed(true, undefined)).toBe(true);
    expect(resolveDataPressed(false, undefined)).toBe(false);
  });
});
