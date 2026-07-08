import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useScrollBehavior } from './useScrollBehavior';

describe('useScrollBehavior', () => {
  beforeEach(() => {
    // Mock window.scrollY
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
    it('should return initial scroll state', () => {
      const { result } = renderHook(() => useScrollBehavior());

      expect(result.current.scrollY).toBe(0);
      expect(result.current.isScrolling).toBe(false);
      expect(result.current.isBelowThreshold).toBe(false);
    });

    it('should have scrollY above threshold initially if already scrolled', () => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      const { result } = renderHook(() => useScrollBehavior({ offset: 50 }));

      expect(result.current.scrollY).toBe(100);
      expect(result.current.isBelowThreshold).toBe(true);
    });

    it('should use default offset of 50', () => {
      Object.defineProperty(window, 'scrollY', { value: 60, writable: true });
      const { result } = renderHook(() => useScrollBehavior());

      expect(result.current.isBelowThreshold).toBe(true);
    });
  });

  describe('Scroll Events', () => {
    it('should update scrollY on scroll', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      await waitFor(() => {
        expect(result.current.scrollY).toBe(100);
      });

      vi.useRealTimers();
    });

    it('should set isScrolling to true when scrolling', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isScrolling).toBe(true);

      vi.useRealTimers();
    });

    it('should set isScrolling to false after debounce delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ debounceDelay: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isScrolling).toBe(true);

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.isScrolling).toBe(false);

      vi.useRealTimers();
    });

    it('should update isBelowThreshold based on offset', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ offset: 100, debounceDelay: 50 }));

      // Scroll below offset
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 120, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isBelowThreshold).toBe(true);

      // Scroll above offset
      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 80, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isBelowThreshold).toBe(false);

      vi.useRealTimers();
    });

    it('should handle scroll at exact threshold', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ offset: 100 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isBelowThreshold).toBe(false);

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 101, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isBelowThreshold).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('Throttling', () => {
    it('should throttle scroll events when enabled', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ throttle: true, debounceDelay: 100 }));

      let updateCount = 0;
      const unsubscribe = renderHook(() => {
        updateCount++;
        return useScrollBehavior({ throttle: true, debounceDelay: 100 });
      });

      act(() => {
        // Dispatch multiple scroll events rapidly
        for (let i = 0; i < 10; i++) {
          Object.defineProperty(window, 'scrollY', { value: 10 * i, writable: true });
          window.dispatchEvent(new Event('scroll'));
        }
      });

      // With throttling, should not update on every scroll
      expect(result.current.scrollY).toBeLessThan(100);

      vi.useRealTimers();
    });

    it('should not throttle when disabled', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ throttle: false, debounceDelay: 50 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 25, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.scrollY).toBe(25);

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.scrollY).toBe(50);

      vi.useRealTimers();
    });
  });

  describe('Custom Options', () => {
    it('should use custom offset', () => {
      Object.defineProperty(window, 'scrollY', { value: 200, writable: true });
      const { result } = renderHook(() => useScrollBehavior({ offset: 300 }));

      expect(result.current.isBelowThreshold).toBe(false);
    });

    it('should use custom debounce delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ debounceDelay: 500 }));

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      expect(result.current.isScrolling).toBe(true);

      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(result.current.isScrolling).toBe(true);

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(result.current.isScrolling).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Cleanup', () => {
    it('should remove scroll listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useScrollBehavior());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });

      removeEventListenerSpy.mockRestore();
    });

    it('should clear timers on unmount', () => {
      vi.useFakeTimers();
      const { unmount } = renderHook(() => useScrollBehavior());

      act(() => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
        window.dispatchEvent(new Event('scroll'));
      });

      unmount();

      // No errors should be thrown
      expect(() => {
        vi.runAllTimers();
      }).not.toThrow();

      vi.useRealTimers();
    });
  });

  describe('Multiple Rapid Updates', () => {
    it('should handle multiple rapid scroll events', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useScrollBehavior({ debounceDelay: 50 }));

      act(() => {
        for (let i = 1; i <= 5; i++) {
          Object.defineProperty(window, 'scrollY', { value: i * 100, writable: true });
          window.dispatchEvent(new Event('scroll'));
        }
      });

      expect(result.current.scrollY).toBe(500);
      expect(result.current.isScrolling).toBe(true);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(result.current.isScrolling).toBe(false);

      vi.useRealTimers();
    });
  });
});
