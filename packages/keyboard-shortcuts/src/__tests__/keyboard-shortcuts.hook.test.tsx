import { renderHook } from '@testing-library/react-hooks';
import * as ShortcutContext from '../keyboard-shortcuts-context';
import { useKeyboardShortcut } from '../index';

describe('useKeyboardShortcut Hook', () => {
  it('registers and unregisters a shortcut', () => {
    const mockRegister = jest.fn(() => jest.fn());
    const spy = jest
      .spyOn(ShortcutContext, 'useShortcutRegistry')
      .mockImplementation(() => ({
        registerShortcut: mockRegister,
      }));

    const { unmount } = renderHook(() =>
      useKeyboardShortcut({ keys: ['k'] }, jest.fn()),
    );

    expect(mockRegister).toHaveBeenCalledTimes(1);
    expect(mockRegister).toHaveBeenCalledWith(
      expect.objectContaining({ keys: ['k'] }),
    );

    unmount();
    spy.mockRestore();
  });
});
