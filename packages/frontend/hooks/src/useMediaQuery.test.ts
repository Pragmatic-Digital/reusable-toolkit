import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let mockMediaQueryList: Partial<MediaQueryList>;

  beforeEach(() => {
    // Reset matchMedia mock
    mockMediaQueryList = {
      matches: false,
      media: '(max-width: 768px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };

    window.matchMedia = vi.fn(() => mockMediaQueryList as MediaQueryList);
  });

  describe('Basic Functionality', () => {
    it('should return false when media query does not match', () => {
      mockMediaQueryList.matches = false;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);
    });

    it('should return true when media query matches', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true);
    });

    it('should call matchMedia with correct query', () => {
      renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
    });
  });

  describe('Event Listeners', () => {
    it('should add event listener on mount', () => {
      renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      unmount();

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should use addListener for older browsers', () => {
      // Reset mock to not have addEventListener
      mockMediaQueryList = {
        matches: false,
        media: '(max-width: 768px)',
        addEventListener: undefined,
        removeEventListener: undefined,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };

      renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(mockMediaQueryList.addListener).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should use removeListener for older browsers on unmount', () => {
      mockMediaQueryList = {
        matches: false,
        media: '(max-width: 768px)',
        addEventListener: undefined,
        removeEventListener: undefined,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };

      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      unmount();

      expect(mockMediaQueryList.removeListener).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Media Query Changes', () => {
    it('should update when media query changes to match', () => {
      mockMediaQueryList.matches = false;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      act(() => {
        mockMediaQueryList.matches = true;
        const callback = (mockMediaQueryList.addEventListener as any).mock.calls[0][1];
        callback({ matches: true } as MediaQueryListEvent);
      });

      expect(result.current).toBe(true);
    });

    it('should update when media query changes to not match', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true);

      act(() => {
        mockMediaQueryList.matches = false;
        const callback = (mockMediaQueryList.addEventListener as any).mock.calls[0][1];
        callback({ matches: false } as MediaQueryListEvent);
      });

      expect(result.current).toBe(false);
    });
  });

  describe('Query Variations', () => {
    it('should handle max-width queries', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true);
    });

    it('should handle min-width queries', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(true);
    });

    it('should handle complex queries with multiple conditions', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() =>
        useMediaQuery('(min-width: 768px) and (max-width: 1024px)')
      );

      expect(result.current).toBe(true);
    });

    it('should handle orientation queries', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(orientation: landscape)'));

      expect(result.current).toBe(true);
    });

    it('should handle prefers-color-scheme queries', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'));

      expect(result.current).toBe(true);
    });
  });

  describe('Multiple Queries', () => {
    it('should handle multiple hooks with different queries', () => {
      const { result: result1 } = renderHook(() => useMediaQuery('(max-width: 768px)'));
      const { result: result2 } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(window.matchMedia).toHaveBeenCalledTimes(2);
      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });
  });

  describe('Query Changes', () => {
    it('should update listeners when query changes', () => {
      const { rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(max-width: 768px)' } }
      );

      const firstAddEventListenerCall = (mockMediaQueryList.addEventListener as any).mock.calls[0];

      rerender({ query: '(min-width: 1024px)' });

      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
    });

    it('should clean up old listener when query changes', () => {
      const { rerender } = renderHook(
        ({ query }) => useMediaQuery(query),
        { initialProps: { query: '(max-width: 768px)' } }
      );

      const firstRemoveEventListenerCall = (mockMediaQueryList.removeEventListener as any).mock
        .calls.length;

      rerender({ query: '(min-width: 1024px)' });

      expect((mockMediaQueryList.removeEventListener as any).mock.calls.length).toBeGreaterThan(
        firstRemoveEventListenerCall
      );
    });
  });

  describe('Browser Compatibility', () => {
    it('should return false when matchMedia is not supported', () => {
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      window.matchMedia = originalMatchMedia;
    });

    it('should handle undefined window gracefully (SSR)', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(false);

      (global as any).window = originalWindow;
    });
  });

  describe('Cleanup', () => {
    it('should clean up listeners on unmount with addEventListener', () => {
      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      unmount();

      expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
    });

    it('should not throw errors on unmount if no listeners attached', () => {
      mockMediaQueryList.addEventListener = undefined;
      mockMediaQueryList.removeEventListener = undefined;
      mockMediaQueryList.addListener = undefined;
      mockMediaQueryList.removeListener = undefined;

      const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Real-World Scenarios', () => {
    it('should work for mobile detection', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

      expect(result.current).toBe(true); // Mobile
    });

    it('should work for tablet detection', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(min-width: 768px) and (max-width: 1024px)'));

      expect(result.current).toBe(true); // Tablet
    });

    it('should work for desktop detection', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

      expect(result.current).toBe(true); // Desktop
    });

    it('should work for dark mode detection', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('(prefers-color-scheme: dark)'));

      expect(result.current).toBe(true); // Dark mode
    });

    it('should work for print media detection', () => {
      mockMediaQueryList.matches = true;
      const { result } = renderHook(() => useMediaQuery('print'));

      expect(result.current).toBe(true); // Print mode
    });
  });
});
