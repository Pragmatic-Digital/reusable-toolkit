import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useScrollDirection } from './useScrollDirection';

describe('useScrollDirection', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Initial State', () => {
    it('should return initial state with direction "none"', () => {
      const { result } = renderHook(() => useScrollDirection());

      expect(result.current.direction).toBe('none');
      expect(result.current.previousScrollY).toBe(0);
      expect(result.current.currentScrollY).toBe(0);
    });

    it('should initialize with current scroll position', () => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      const { result } = renderHook(() => useScrollDirection());

      expect(result.current.currentScrollY).toBe(100);
    });
  });

  describe('Scroll Direction Detection', () => {
    it('should detect scroll down direction', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');
      expect(result.current.currentScrollY).toBe(50);

      vi.useRealTimers();
    });

    it('should detect scroll up direction', async () => {
      vi.useFakeTimers();
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('up');
      expect(result.current.currentScrollY).toBe(50);

      vi.useRealTimers();
    });

    it('should track previous scroll position', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.previousScrollY).toBe(0);

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.previousScrollY).toBe(100);

      vi.useRealTimers();
    });

    it('should not change direction if scroll distance below threshold', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 50, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('none');

      vi.useRealTimers();
    });

    it('should change direction when threshold is exceeded', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 20, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 19, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('none');

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 40, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      vi.useRealTimers();
    });
  });

  describe('Debounce Behavior', () => {
    it('should reset direction to "none" after debounce delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.direction).toBe('none');

      vi.useRealTimers();
    });

    it('should use custom debounce delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 300 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(result.current.direction).toBe('down');

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.direction).toBe('none');

      vi.useRealTimers();
    });
  });

  describe('Custom Threshold', () => {
    it('should use custom threshold value', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 100, debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('none');

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 150, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      vi.useRealTimers();
    });

    it('should use default threshold of 10', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 10, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      vi.useRealTimers();
    });
  });

  describe('Rapid Scrolling', () => {
    it('should handle rapid scroll events', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 100 }));

      act(() => {
        for (let i = 1; i <= 5; i++) {
          Object.defineProperty(window, 'scrollY', { value: i * 50, writable: true });
          window.dispatchEvent(new Event('scroll'));
        }
      });

      expect(result.current.direction).toBe('down');
      expect(result.current.currentScrollY).toBe(250);

      vi.useRealTimers();
    });

    it('should track direction changes in rapid succession', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 50 }));

      // Scroll down
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      // Change to scroll up
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('up');

      vi.useRealTimers();
    });
  });

  describe('Cleanup', () => {
    it('should remove scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useScrollDirection());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });

      removeEventListenerSpy.mockRestore();
    });

    it('should clear debounce timer on unmount', () => {
      vi.useFakeTimers();
      const { unmount } = renderHook(() => useScrollDirection());

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      unmount();

      expect(() => {
        vi.runAllTimers();
      }).not.toThrow();

      vi.useRealTimers();
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero scroll position', async () => {
      vi.useFakeTimers();
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('up');
      expect(result.current.currentScrollY).toBe(0);

      vi.useRealTimers();
    });

    it('should handle large scroll jumps', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 10, debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 5000, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');
      expect(result.current.currentScrollY).toBe(5000);

      vi.useRealTimers();
    });

    it('should work with scroll position at exactly threshold value', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollDirection({ threshold: 50, debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.direction).toBe('down');

      vi.useRealTimers();
    });
  });
});
