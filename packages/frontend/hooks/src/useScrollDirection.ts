import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Scroll direction type
 */
export type ScrollDirection = 'up' | 'down' | 'none';

/**
 * Scroll direction state
 */
export interface ScrollDirectionState {
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Previous scroll Y position */
  previousScrollY: number;
  /** Current scroll Y position */
  currentScrollY: number;
}

/**
 * Hook configuration options
 */
export interface UseScrollDirectionOptions {
  /** Minimum pixels scrolled to register direction change (default: 10) */
  threshold?: number;
  /** Debounce delay in milliseconds (default: 150) */
  debounceDelay?: number;
}

/**
 * Custom hook for detecting scroll direction (up or down)
 *
 * Tracks the direction the user is scrolling and can be used to hide/show
 * headers, buttons, or other UI elements on scroll.
 *
 * @param options - Configuration options
 * @returns Object containing scroll direction state
 *
 * @example
 * ```tsx
 * const { direction } = useScrollDirection({ threshold: 50 });
 *
 * return (
 *   <header
 *     style={{
 *       transform: direction === 'down' ? 'translateY(-100%)' : 'translateY(0)'
 *     }}
 *   >
 *     Sticky Header
 *   </header>
 * );
 * ```
 */
export function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): ScrollDirectionState {
  const { threshold = 10, debounceDelay = 150 } = options;

  const [scrollState, setScrollState] = useState<ScrollDirectionState>({
    direction: 'none',
    previousScrollY: 0,
    currentScrollY: 0,
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY || 0;
    const difference = Math.abs(currentScrollY - lastScrollY.current);

    // Only detect direction if scroll distance exceeds threshold
    if (difference >= threshold) {
      const direction: ScrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';

      // Clear existing debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Update state with new scroll direction
      setScrollState({
        direction,
        previousScrollY: lastScrollY.current,
        currentScrollY,
      });

      // Update reference
      lastScrollY.current = currentScrollY;

      // Set direction back to 'none' after debounce delay
      debounceTimer.current = setTimeout(() => {
        setScrollState((prevState) => ({
          ...prevState,
          direction: 'none',
        }));
      }, debounceDelay);
    }
  }, [threshold, debounceDelay]);

  useEffect(() => {
    // Initialize last scroll position
    lastScrollY.current = window.scrollY || 0;
    setScrollState({
      direction: 'none',
      previousScrollY: 0,
      currentScrollY: window.scrollY || 0,
    });

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      // Clean up listener and timer
      window.removeEventListener('scroll', handleScroll);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [handleScroll]);

  return scrollState;
}
