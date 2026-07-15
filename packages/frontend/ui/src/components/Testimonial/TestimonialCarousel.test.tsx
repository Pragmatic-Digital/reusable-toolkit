import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import axe from 'axe-core';
import { TestimonialCarousel } from './TestimonialCarousel';
import type { TestimonialProps } from './Testimonial';

const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

const items: TestimonialProps[] = [
  { quote: 'First quote.', author: 'Author One', company: 'Alpha', rating: 5 },
  { quote: 'Second quote.', author: 'Author Two', company: 'Beta', rating: 4.5 },
  { quote: 'Third quote.', author: 'Author Three', company: 'Gamma', rating: 4 },
];

const activeSlide = () =>
  screen.getAllByTestId('testimonial-slide').find((s) => s.getAttribute('data-active') === 'true');

describe('TestimonialCarousel Component', () => {
  // =========================================================================
  // Rendering
  // =========================================================================

  describe('Rendering', () => {
    it('should render one slide per testimonial', () => {
      render(<TestimonialCarousel testimonials={items} />);
      expect(screen.getAllByTestId('testimonial-slide')).toHaveLength(3);
    });

    it('should expose the carousel with the APG roledescription and label', () => {
      render(<TestimonialCarousel testimonials={items} ariaLabel="Customer testimonials" />);
      const carousel = screen.getByTestId('testimonial-carousel');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
      expect(carousel).toHaveAttribute('aria-label', 'Customer testimonials');
    });

    it('should label each slide as "N of M"', () => {
      render(<TestimonialCarousel testimonials={items} />);
      const slides = screen.getAllByTestId('testimonial-slide');
      expect(slides[0]).toHaveAttribute('aria-label', '1 of 3');
      expect(slides[2]).toHaveAttribute('aria-label', '3 of 3');
    });

    it('should start on the first slide', () => {
      render(<TestimonialCarousel testimonials={items} />);
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
      expect(within(activeSlide()!).getByText(/First quote\./)).toBeInTheDocument();
    });

    it('should render one pagination dot per testimonial', () => {
      render(<TestimonialCarousel testimonials={items} />);
      expect(screen.getAllByTestId('testimonial-dot')).toHaveLength(3);
    });

    it('should mark inactive slides aria-hidden', () => {
      render(<TestimonialCarousel testimonials={items} />);
      const slides = screen.getAllByTestId('testimonial-slide');
      expect(slides[0]).toHaveAttribute('aria-hidden', 'false');
      expect(slides[1]).toHaveAttribute('aria-hidden', 'true');
    });

    it('should forward a ref to the root element', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<TestimonialCarousel testimonials={items} ref={ref} />);
      expect(ref.current).toBe(screen.getByTestId('testimonial-carousel'));
    });
  });

  // =========================================================================
  // Navigation — buttons
  // =========================================================================

  describe('Button navigation', () => {
    it('should advance with the next button', () => {
      render(<TestimonialCarousel testimonials={items} />);
      fireEvent.click(screen.getByTestId('testimonial-next'));
      expect(activeSlide()).toHaveAttribute('aria-label', '2 of 3');
    });

    it('should go back with the previous button', () => {
      render(<TestimonialCarousel testimonials={items} />);
      fireEvent.click(screen.getByTestId('testimonial-next'));
      fireEvent.click(screen.getByTestId('testimonial-prev'));
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
    });

    it('should jump to a slide via its pagination dot', () => {
      render(<TestimonialCarousel testimonials={items} />);
      fireEvent.click(screen.getAllByTestId('testimonial-dot')[2]);
      expect(activeSlide()).toHaveAttribute('aria-label', '3 of 3');
    });

    it('should mark the active dot as selected', () => {
      render(<TestimonialCarousel testimonials={items} />);
      const dots = screen.getAllByTestId('testimonial-dot');
      expect(dots[0]).toHaveAttribute('aria-selected', 'true');
      fireEvent.click(dots[1]);
      expect(dots[1]).toHaveAttribute('aria-selected', 'true');
      expect(dots[0]).toHaveAttribute('aria-selected', 'false');
    });
  });

  // =========================================================================
  // Looping vs bounded
  // =========================================================================

  describe('Looping', () => {
    it('should wrap from last to first when looping (default)', () => {
      render(<TestimonialCarousel testimonials={items} />);
      fireEvent.click(screen.getByTestId('testimonial-prev'));
      expect(activeSlide()).toHaveAttribute('aria-label', '3 of 3');
    });

    it('should disable prev on the first slide when not looping', () => {
      render(<TestimonialCarousel testimonials={items} loop={false} />);
      expect(screen.getByTestId('testimonial-prev')).toBeDisabled();
      expect(screen.getByTestId('testimonial-next')).toBeEnabled();
    });

    it('should disable next on the last slide when not looping', () => {
      render(<TestimonialCarousel testimonials={items} loop={false} />);
      fireEvent.click(screen.getByTestId('testimonial-next'));
      fireEvent.click(screen.getByTestId('testimonial-next'));
      expect(screen.getByTestId('testimonial-next')).toBeDisabled();
      expect(activeSlide()).toHaveAttribute('aria-label', '3 of 3');
    });
  });

  // =========================================================================
  // Keyboard
  // =========================================================================

  describe('Keyboard navigation', () => {
    it('should advance on ArrowRight and go back on ArrowLeft', () => {
      render(<TestimonialCarousel testimonials={items} />);
      const carousel = screen.getByTestId('testimonial-carousel');
      fireEvent.keyDown(carousel, { key: 'ArrowRight' });
      expect(activeSlide()).toHaveAttribute('aria-label', '2 of 3');
      fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
    });

    it('should jump to first and last with Home and End', () => {
      render(<TestimonialCarousel testimonials={items} />);
      const carousel = screen.getByTestId('testimonial-carousel');
      fireEvent.keyDown(carousel, { key: 'End' });
      expect(activeSlide()).toHaveAttribute('aria-label', '3 of 3');
      fireEvent.keyDown(carousel, { key: 'Home' });
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
    });
  });

  // =========================================================================
  // Touch / swipe
  // =========================================================================

  describe('Touch swipe', () => {
    it('should advance on a left swipe past the threshold', () => {
      render(<TestimonialCarousel testimonials={items} swipeThreshold={40} />);
      const track = screen.getByTestId('testimonial-carousel');
      fireEvent.touchStart(track, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(track, { changedTouches: [{ clientX: 120 }] });
      expect(activeSlide()).toHaveAttribute('aria-label', '2 of 3');
    });

    it('should go back on a right swipe past the threshold', () => {
      render(<TestimonialCarousel testimonials={items} swipeThreshold={40} />);
      const track = screen.getByTestId('testimonial-carousel');
      fireEvent.touchStart(track, { touches: [{ clientX: 100 }] });
      fireEvent.touchEnd(track, { changedTouches: [{ clientX: 220 }] });
      // From slide 1, a right swipe loops to the last slide.
      expect(activeSlide()).toHaveAttribute('aria-label', '3 of 3');
    });

    it('should ignore a swipe below the threshold', () => {
      render(<TestimonialCarousel testimonials={items} swipeThreshold={40} />);
      const track = screen.getByTestId('testimonial-carousel');
      fireEvent.touchStart(track, { touches: [{ clientX: 200 }] });
      fireEvent.touchEnd(track, { changedTouches: [{ clientX: 180 }] });
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
    });
  });

  // =========================================================================
  // Autoplay
  // =========================================================================

  describe('Autoplay', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('should auto-advance on the configured interval', () => {
      render(<TestimonialCarousel testimonials={items} autoplay autoplayInterval={3000} />);
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(activeSlide()).toHaveAttribute('aria-label', '2 of 3');
    });

    it('should mark the carousel as playing while autoplaying', () => {
      render(<TestimonialCarousel testimonials={items} autoplay autoplayInterval={3000} />);
      expect(screen.getByTestId('testimonial-carousel')).toHaveAttribute('data-playing', 'true');
    });

    it('should set the live region to off while autoplaying', () => {
      render(<TestimonialCarousel testimonials={items} autoplay autoplayInterval={3000} />);
      expect(screen.getByTestId('testimonial-carousel-track')).toHaveAttribute('aria-live', 'off');
    });

    it('should set the live region to polite when not autoplaying', () => {
      render(<TestimonialCarousel testimonials={items} />);
      expect(screen.getByTestId('testimonial-carousel-track')).toHaveAttribute('aria-live', 'polite');
    });

    it('should pause on mouse enter and resume on mouse leave', () => {
      render(<TestimonialCarousel testimonials={items} autoplay autoplayInterval={3000} />);
      const carousel = screen.getByTestId('testimonial-carousel');

      fireEvent.mouseEnter(carousel);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');

      fireEvent.mouseLeave(carousel);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(activeSlide()).toHaveAttribute('aria-label', '2 of 3');
    });

    it('should pause on focus and resume on blur', () => {
      render(<TestimonialCarousel testimonials={items} autoplay autoplayInterval={3000} />);
      const carousel = screen.getByTestId('testimonial-carousel');

      fireEvent.focus(carousel);
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(activeSlide()).toHaveAttribute('aria-label', '1 of 3');
    });
  });

  // =========================================================================
  // Single / empty
  // =========================================================================

  describe('Edge cases', () => {
    it('should hide the controls for a single testimonial', () => {
      render(<TestimonialCarousel testimonials={[items[0]]} />);
      expect(screen.getByTestId('testimonial-slide')).toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-next')).not.toBeInTheDocument();
      expect(screen.queryByTestId('testimonial-pagination')).not.toBeInTheDocument();
    });

    it('should render nothing for an empty testimonials array', () => {
      const { container } = render(<TestimonialCarousel testimonials={[]} />);
      expect(container.firstChild).toBeNull();
    });
  });

  // =========================================================================
  // Accessibility & snapshot
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations', async () => {
      const { container } = render(
        <TestimonialCarousel testimonials={items} ariaLabel="Customer testimonials" />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should match the snapshot', () => {
      const { container } = render(
        <TestimonialCarousel testimonials={items} ariaLabel="Customer testimonials" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
