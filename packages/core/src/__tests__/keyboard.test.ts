import { act, renderHook } from '@testing-library/react-hooks';
import { type NativeSyntheticEvent, Platform } from 'react-native';

import { ACTIVATION_KEYS } from '../constants';
import { useKeyboard, useKeyboardActivation } from '../keyboard';
import type { KeyPressEventData } from '../types';

// Mock Platform with proper type definitions
jest.mock('react-native', () => {
  const mockPlatform = {
    OS: 'ios',
    select: jest.fn((options: Record<string, string>) => options.default),
  };
  return {
    NativeSyntheticEvent: jest.fn((event: Record<string, unknown>) => ({
      nativeEvent: event,
    })),
    Platform: mockPlatform,
  };
});

jest.useFakeTimers();

type MockKeyboardEvent = NativeSyntheticEvent<KeyPressEventData>;

const createMockKeyboardEvent = (key: string): MockKeyboardEvent => {
  return {
    nativeEvent: { key },
    preventDefault: jest.fn(),
  } as unknown as MockKeyboardEvent;
};

describe('useKeyboardActivation', () => {
  let onActivate: jest.Mock;

  beforeEach(() => {
    onActivate = jest.fn();
  });

  it('should call onActivate when an activation key is pressed', () => {
    const { result } = renderHook(() => useKeyboardActivation(onActivate));
    const handler = result.current;

    ACTIVATION_KEYS.forEach((key) => {
      act(() => {
        handler(createMockKeyboardEvent(key));
      });
      expect(onActivate).toHaveBeenCalledTimes(1);
      onActivate.mockClear();
    });
  });

  it('should not call onActivate for non-activation keys', () => {
    const { result } = renderHook(() => useKeyboardActivation(onActivate));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowRight'));
    });
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('should not call onActivate if disabled', () => {
    const { result } = renderHook(() =>
      useKeyboardActivation(onActivate, true),
    );
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('Enter'));
    });
    expect(onActivate).not.toHaveBeenCalled();
  });

  it('should prevent default event behavior for activation keys', () => {
    const preventDefault = jest.fn();
    const { result } = renderHook(() => useKeyboardActivation(onActivate));
    const handler = result.current;

    act(() => {
      handler({
        nativeEvent: { key: 'Enter' },
        preventDefault,
      } as unknown as MockKeyboardEvent);
    });
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should not prevent default event behavior for non-activation keys', () => {
    const preventDefault = jest.fn();
    const { result } = renderHook(() => useKeyboardActivation(onActivate));
    const handler = result.current;

    act(() => {
      handler({
        nativeEvent: { key: 'ArrowUp' },
        preventDefault,
      } as unknown as MockKeyboardEvent);
    });
    expect(preventDefault).not.toHaveBeenCalled();
  });
});

describe('useKeyboard', () => {
  let options: {
    onArrowUp: jest.Mock;
    onArrowDown: jest.Mock;
    onArrowLeft: jest.Mock;
    onArrowRight: jest.Mock;
    onPageUp: jest.Mock;
    onPageDown: jest.Mock;
    onHome: jest.Mock;
    onEnd: jest.Mock;
    disabled: boolean;
  };

  beforeEach(() => {
    options = {
      disabled: false,
      onArrowDown: jest.fn(),
      onArrowLeft: jest.fn(),
      onArrowRight: jest.fn(),
      onArrowUp: jest.fn(),
      onEnd: jest.fn(),
      onHome: jest.fn(),
      onPageDown: jest.fn(),
      onPageUp: jest.fn(),
    };
  });

  it('should call onArrowRight for ArrowRight', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowRight'));
    });
    expect(options.onArrowRight).toHaveBeenCalledTimes(1);
    expect(options.onArrowUp).not.toHaveBeenCalled();
  });

  it('should call onArrowUp for ArrowUp', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowUp'));
    });
    expect(options.onArrowUp).toHaveBeenCalledTimes(1);
  });

  it('should call onArrowLeft for ArrowLeft', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowLeft'));
    });
    expect(options.onArrowLeft).toHaveBeenCalledTimes(1);
  });

  it('should call onArrowDown for ArrowDown', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowDown'));
    });
    expect(options.onArrowDown).toHaveBeenCalledTimes(1);
  });

  it('should call onPageUp for PageUp', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('PageUp'));
    });
    expect(options.onPageUp).toHaveBeenCalledTimes(1);
  });

  it('should call onPageDown for PageDown', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('PageDown'));
    });
    expect(options.onPageDown).toHaveBeenCalledTimes(1);
  });

  it('should call onHome for Home', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('Home'));
    });
    expect(options.onHome).toHaveBeenCalledTimes(1);
  });

  it('should call onEnd for End', () => {
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('End'));
    });
    expect(options.onEnd).toHaveBeenCalledTimes(1);
  });

  it('should prevent default event behavior for handled keys', () => {
    const preventDefault = jest.fn();
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler({
        nativeEvent: { key: 'ArrowRight' },
        preventDefault,
      } as unknown as MockKeyboardEvent);
    });
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should not prevent default event behavior for unhandled keys', () => {
    const preventDefault = jest.fn();
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler({
        nativeEvent: { key: 'A' },
        preventDefault,
      } as unknown as MockKeyboardEvent);
    });
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('should not call any callbacks if disabled', () => {
    options.disabled = true;
    const { result } = renderHook(() => useKeyboard(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowRight'));
    });
    expect(options.onArrowRight).not.toHaveBeenCalled();
    expect(options.onArrowLeft).not.toHaveBeenCalled();
    expect(options.onHome).not.toHaveBeenCalled();
    expect(options.onEnd).not.toHaveBeenCalled();
  });
});

describe('useKeyboardNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    (Platform as { OS: string }).OS = 'ios';
    (Platform.select as jest.Mock).mockImplementation(
      (options: Record<string, string>) => options.default,
    );
  });
  it('should be a dummy test', () => {
    expect(true).toBe(true);
  });

  // Tests continue...
});
