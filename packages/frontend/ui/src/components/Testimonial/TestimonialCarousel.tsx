import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { useMediaQuery } from '@pragmatic/hooks';
import { Testimonial, TestimonialProps, TestimonialVariant } from './Testimonial';

export interface TestimonialCarouselProps {
  /** Testimonials to rotate through. Each is a full `Testimonial` config. */
  testimonials: TestimonialProps[];
  /** Variant applied to every slide, unless the slide sets its own. */
  variant?: TestimonialVariant;
  /** Accessible name for the carousel, e.g. "Customer testimonials". */
  ariaLabel?: string;
  /** Auto-advance slides. Ignored when the user prefers reduced motion. */
  autoplay?: boolean;
  /** Auto-advance interval in ms. Defaults to 6000. */
  autoplayInterval?: number;
  /** Wrap from last to first and vice versa. Defaults to true. */
  loop?: boolean;
  /** Minimum horizontal travel (px) to register a swipe. Defaults to 40. */
  swipeThreshold?: number;
  /** Additional classes on the root element */
  className?: string;
}

/**
 * TestimonialCarousel
 *
 * A rotating set of testimonials. Deliberately decoupled from `Testimonial`'s
 * internals — it composes the base component, so `Testimonial` stays usable on
 * its own. Follows the APG carousel pattern:
 *
 * - `aria-roledescription="carousel"` region with an accessible label
 * - each slide is a labelled group ("N of M")
 * - previous/next buttons and pagination dots, all keyboard operable
 * - arrow/Home/End keys navigate when the carousel has focus
 * - touch swipe on the track
 * - optional autoplay that pauses on hover and focus, and never starts when the
 *   user prefers reduced motion
 * - the live region is polite while stopped and off while auto-rotating
 */
export const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  (
    {
      testimonials,
      variant,
      ariaLabel = 'Testimonials',
      autoplay = false,
      autoplayInterval = 6000,
      loop = true,
      swipeThreshold = 40,
      className,
    },
    ref,
  ) => {
    const count = testimonials.length;
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const baseId = useId();
    const touchStartX = useRef<number | null>(null);

    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const isPlaying = autoplay && !prefersReducedMotion && !paused && count > 1;

    const goTo = useCallback(
      (next: number) => {
        if (count === 0) return;
        if (loop) {
          setIndex(((next % count) + count) % count);
        } else {
          setIndex(Math.min(Math.max(next, 0), count - 1));
        }
      },
      [count, loop],
    );

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const previous = useCallback(() => goTo(index - 1), [goTo, index]);

    // Keep the index valid if the testimonials array shrinks.
    useEffect(() => {
      if (index > count - 1) setIndex(Math.max(count - 1, 0));
    }, [count, index]);

    // Autoplay timer. Cleared while paused/reduced-motion, so it also serves as
    // the pause-on-hover/focus mechanism.
    useEffect(() => {
      if (!isPlaying) return;
      const timer = window.setInterval(() => {
        setIndex((current) => (loop ? (current + 1) % count : Math.min(current + 1, count - 1)));
      }, autoplayInterval);
      return () => window.clearInterval(timer);
    }, [isPlaying, autoplayInterval, count, loop]);

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          previous();
          break;
        case 'Home':
          event.preventDefault();
          goTo(0);
          break;
        case 'End':
          event.preventDefault();
          goTo(count - 1);
          break;
        default:
          break;
      }
    };

    const onTouchStart = (event: React.TouchEvent) => {
      touchStartX.current = event.touches[0]?.clientX ?? null;
    };

    const onTouchEnd = (event: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
      if (Math.abs(delta) >= swipeThreshold) {
        if (delta < 0) next();
        else previous();
      }
      touchStartX.current = null;
    };

    if (count === 0) return null;

    const pause = () => setPaused(true);
    const resume = () => setPaused(false);

    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        data-testid="testimonial-carousel"
        data-playing={isPlaying || undefined}
        className={clsx('relative', className)}
        onKeyDown={onKeyDown}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides. The live region is off while auto-rotating, polite when stopped. */}
        <div
          data-testid="testimonial-carousel-track"
          aria-live={isPlaying ? 'off' : 'polite'}
          className="overflow-hidden"
        >
          <div
            className={clsx(
              'flex',
              !prefersReducedMotion && 'transition-transform duration-500 ease-out',
            )}
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {testimonials.map((testimonial, i) => {
              const active = i === index;
              return (
                <div
                  key={`${baseId}-slide-${i}`}
                  id={`${baseId}-slide-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={!active}
                  // Keep off-screen slides out of the tab order.
                  {...(!active ? { inert: '' } : {})}
                  data-testid="testimonial-slide"
                  data-active={active || undefined}
                  className="w-full shrink-0 px-1"
                >
                  <Testimonial {...testimonial} variant={testimonial.variant ?? variant} />
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 && (
          <>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={previous}
                disabled={!loop && index === 0}
                aria-label="Previous testimonial"
                data-testid="testimonial-prev"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-40"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div role="tablist" aria-label="Choose testimonial" data-testid="testimonial-pagination" className="flex items-center gap-2">
                {testimonials.map((_, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={`${baseId}-dot-${i}`}
                      type="button"
                      role="tab"
                      aria-label={`Go to testimonial ${i + 1}`}
                      aria-selected={active}
                      aria-controls={`${baseId}-slide-${i}`}
                      data-testid="testimonial-dot"
                      data-active={active || undefined}
                      onClick={() => goTo(i)}
                      className={clsx(
                        'h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                        active ? 'w-6 bg-indigo-600' : 'w-2.5 bg-slate-300 hover:bg-slate-400',
                      )}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={next}
                disabled={!loop && index === count - 1}
                aria-label="Next testimonial"
                data-testid="testimonial-next"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-40"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Status for assistive tech, mirrors the visible position. */}
            <div className="sr-only" aria-live="polite" data-testid="testimonial-status">
              Testimonial {index + 1} of {count}
            </div>
          </>
        )}
      </div>
    );
  },
);

TestimonialCarousel.displayName = 'TestimonialCarousel';
