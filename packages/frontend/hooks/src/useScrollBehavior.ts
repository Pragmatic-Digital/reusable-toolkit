import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Scroll state information
 */
export interface ScrollState {
  /** Current vertical scroll position in pixels */
  scrollY: number;
  /** Whether user is currently scrolling */
  isScrolling: boolean;
  /** Whether scroll position is below threshold */
  isBelowThreshold: boolean;
}

/**
 * Hook configuration options
 */
export interface UseScrollBehaviorOptions {
  /** Pixel offset before triggering threshold state (default: 50) */
  offset?: number;
  /** Debounce delay in milliseconds (default: 150) */
  debounceDelay?: number;
  /** Whether to throttle scroll events (default: true) */
  throttle?: boolean;
}

/**
 * Custom hook for detecting scroll behaviour and position
 *
 * Tracks current scroll position, scroll state, and provides threshold detection.
 * Useful for sticky headers that change appearance based on scroll position.
 *
 * @param options - Configuration options
 * @returns Object containing scroll state
 *
 * @example
 * ```tsx
 * const { scrollY, isScrolling, isBelowThreshold } = useScrollBehavior({ offset: 100 });
 *
 * return (
 *   <header
 *     style={{
 *       backgroundColor: isBelowThreshold ? '#fff' : 'transparent'
 *     }}
 *   >
 *     Sticky Header
 *   </header>
 * );
 * ```
 */
export function useScrollBehavior(options: UseScrollBehaviorOptions = {}): ScrollState {
  const {
    offset = 50,
    debounceDelay = 150,
    throttle: shouldThrottle = true,
  } = options;

  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolling: false,
    isBelowThreshold: false,
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollingTimer = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY || 0;
    const belowThreshold = currentScrollY > offset;

    // Update scroll state immediately
    setScrollState((prevState) => ({
      ...prevState,
      scrollY: currentScrollY,
      isBelowThreshold: belowThreshold,
      isScrolling: true,
    }));

    // Clear previous scrolling timer
    if (scrollingTimer.current) {
      clearTimeout(scrollingTimer.current);
    }

    // Set scrolling state to false after user stops scrolling
    scrollingTimer.current = setTimeout(() => {
      setScrollState((prevState) => ({
        ...prevState,
        isScrolling: false,
      }));
    }, debounceDelay);
  }, [offset, debounceDelay]);

  const throttledScroll = useCallback(() => {
    if (!throttleTimer.current) {
      handleScroll();
      throttleTimer.current = setTimeout(() => {
        throttleTimer.current = null;
      }, debounceDelay);
    }
  }, [handleScroll, debounceDelay]);

  useEffect(() => {
    // Get initial scroll position
    const currentScrollY = window.scrollY || 0;
    setScrollState({
      scrollY: currentScrollY,
      isScrolling: false,
      isBelowThreshold: currentScrollY > offset,
    });

    // Choose scroll handler
    const scrollHandler = shouldThrottle ? throttledScroll : handleScroll;

    // Attach scroll listener
    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      // Clean up listeners and timers
      window.removeEventListener('scroll', scrollHandler);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (scrollingTimer.current) clearTimeout(scrollingTimer.current);
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
    };
  }, [offset, shouldThrottle, throttledScroll, handleScroll]);

  return scrollState;
}
