import { renderHook, act } from '@testing-library/react-hooks';
import { useKeyboardActivation, useKeyboardRange } from '../keyboard';
import { ACTIVATION_KEYS } from '../constants';
import { Platform, type NativeSyntheticEvent } from 'react-native';
import type { KeyPressEventData } from '../types';

// Mock Platform with proper type definitions
jest.mock('react-native', () => {
  const mockPlatform = {
    OS: 'ios',
    select: jest.fn((options: Record<string, string>) => options.default),
  };
  return {
    Platform: mockPlatform,
    NativeSyntheticEvent: jest.fn((event: Record<string, unknown>) => ({
      nativeEvent: event,
    })),
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

describe('useKeyboardRange', () => {
  let options: {
    onIncrement: jest.Mock;
    onDecrement: jest.Mock;
    onPageUp: jest.Mock;
    onPageDown: jest.Mock;
    onHome: jest.Mock;
    onEnd: jest.Mock;
    disabled: boolean;
    orientation: 'horizontal' | 'vertical';
  };

  beforeEach(() => {
    options = {
      onIncrement: jest.fn(),
      onDecrement: jest.fn(),
      onPageUp: jest.fn(),
      onPageDown: jest.fn(),
      onHome: jest.fn(),
      onEnd: jest.fn(),
      disabled: false,
      orientation: 'horizontal',
    };
  });

  it('should call onIncrement for ArrowRight/ArrowUp', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowRight'));
    });
    expect(options.onIncrement).toHaveBeenCalledTimes(1);
    expect(options.onDecrement).not.toHaveBeenCalled();

    act(() => {
      handler(createMockKeyboardEvent('ArrowUp'));
    });
    expect(options.onIncrement).toHaveBeenCalledTimes(2);
  });

  it('should call onDecrement for ArrowLeft/ArrowDown', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowLeft'));
    });
    expect(options.onDecrement).toHaveBeenCalledTimes(1);
    expect(options.onIncrement).not.toHaveBeenCalled();

    act(() => {
      handler(createMockKeyboardEvent('ArrowDown'));
    });
    expect(options.onDecrement).toHaveBeenCalledTimes(2);
  });

  it('should call onPageUp for PageUp', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('PageUp'));
    });
    expect(options.onPageUp).toHaveBeenCalledTimes(1);
  });

  it('should call onPageDown for PageDown', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('PageDown'));
    });
    expect(options.onPageDown).toHaveBeenCalledTimes(1);
  });

  it('should call onHome for Home', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('Home'));
    });
    expect(options.onHome).toHaveBeenCalledTimes(1);
  });

  it('should call onEnd for End', () => {
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('End'));
    });
    expect(options.onEnd).toHaveBeenCalledTimes(1);
  });

  it('should prevent default event behavior for handled keys', () => {
    const preventDefault = jest.fn();
    const { result } = renderHook(() => useKeyboardRange(options));
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
    const { result } = renderHook(() => useKeyboardRange(options));
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
    const { result } = renderHook(() => useKeyboardRange(options));
    const handler = result.current;

    act(() => {
      handler(createMockKeyboardEvent('ArrowRight'));
    });
    expect(options.onIncrement).not.toHaveBeenCalled();
    expect(options.onDecrement).not.toHaveBeenCalled();
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
