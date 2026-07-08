import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook for detecting media query matches
 *
 * Detects if the user's viewport matches a given CSS media query.
 * Useful for responsive design without relying on CSS media queries alone.
 *
 * @param query - CSS media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if media query matches
 *
 * @example
 * ```tsx
 * const isMobile = useMediaQuery('(max-width: 768px)');
 *
 * return (
 *   <nav>
 *     {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *   </nav>
 * );
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  const handleChange = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    setMatches(e.matches);
  }, []);

  useEffect(() => {
    // Check if window is available (SSR compatibility)
    if (typeof window === 'undefined') {
      return;
    }

    // Check if matchMedia is supported
    if (!window.matchMedia) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Add listener using the new addEventListener API if available
    // Fall back to deprecated addListener for older browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else if (mediaQueryList.addListener) {
      // Deprecated API for older Safari versions
      mediaQueryList.addListener(handleChange);
    }

    return () => {
      // Clean up listener
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else if (mediaQueryList.removeListener) {
        // Deprecated API for older Safari versions
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query, handleChange]);

  return isSupported ? matches : false;
}
