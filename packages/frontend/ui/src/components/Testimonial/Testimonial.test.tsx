import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { Testimonial, StarRating } from './Testimonial';

const PHOTO = 'https://cdn.example.com/author.jpg';

const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

describe('Testimonial Component', () => {
  // =========================================================================
  // Required props
  // =========================================================================

  describe('Required props only', () => {
    it('should render with just a quote and author', () => {
      render(<Testimonial quote="Great product." author="Sam Carter" />);
      expect(screen.getByText(/Great product\./)).toBeInTheDocument();
      expect(screen.getByTestId('testimonial-author')).toHaveTextContent('Sam Carter');
    });

    it('should use semantic figure / blockquote / figcaption markup', () => {
      const { container } = render(<Testimonial quote="Great product." author="Sam Carter" />);
      expect(container.querySelector('figure')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(container.querySelector('figcaption')).toBeInTheDocument();
    });

    it('should wrap a string quote in quotation marks', () => {
      render(<Testimonial quote="Great product." author="Sam" />);
      expect(screen.getByText('“Great product.”')).toBeInTheDocument();
    });

    it('should render a ReactNode quote as-is, without added quotation marks', () => {
      render(<Testimonial quote={<p>Custom node quote</p>} author="Sam" />);
      expect(screen.getByText('Custom node quote')).toBeInTheDocument();
      expect(screen.queryByText(/“/)).not.toBeInTheDocument();
    });

    it('should forward a ref to the figure element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Testimonial quote="Q" author="A" ref={ref} />);
      expect(ref.current?.tagName).toBe('FIGURE');
    });
  });

  // =========================================================================
  // Optional fields
  // =========================================================================

  describe('Optional fields', () => {
    it('should render company and role as a combined meta line when provided', () => {
      render(<Testimonial quote="Q" author="A" authorRole="CTO" company="Lumen" />);
      expect(screen.getByTestId('testimonial-meta')).toHaveTextContent('CTO, Lumen');
    });

    it('should render just the company when no role is given', () => {
      render(<Testimonial quote="Q" author="A" company="Lumen" />);
      expect(screen.getByTestId('testimonial-meta')).toHaveTextContent('Lumen');
    });

    it('should render just the role when no company is given', () => {
      render(<Testimonial quote="Q" author="A" authorRole="CTO" />);
      expect(screen.getByTestId('testimonial-meta')).toHaveTextContent('CTO');
    });

    it('should omit the meta line when neither role nor company is given', () => {
      render(<Testimonial quote="Q" author="A" />);
      expect(screen.queryByTestId('testimonial-meta')).not.toBeInTheDocument();
    });

    it('should omit the rating when not provided', () => {
      render(<Testimonial quote="Q" author="A" />);
      expect(screen.queryByTestId('rating')).not.toBeInTheDocument();
    });
  });

  // =========================================================================
  // Avatar / photo
  // =========================================================================

  describe('Author photo', () => {
    it('should render the photo with the provided alt text', () => {
      render(<Testimonial quote="Q" author="A" image={PHOTO} imageAlt="Author portrait" />);
      const img = screen.getByTestId('testimonial-avatar-image');
      expect(img).toHaveAttribute('src', PHOTO);
      expect(img).toHaveAttribute('alt', 'Author portrait');
      expect(screen.queryByTestId('testimonial-avatar-fallback')).not.toBeInTheDocument();
    });

    it('should default the photo alt to the author name', () => {
      render(<Testimonial quote="Q" author="Jordan Lee" image={PHOTO} />);
      expect(screen.getByTestId('testimonial-avatar-image')).toHaveAttribute('alt', 'Jordan Lee');
    });

    it('should lazy-load the photo', () => {
      render(<Testimonial quote="Q" author="A" image={PHOTO} />);
      expect(screen.getByTestId('testimonial-avatar-image')).toHaveAttribute('loading', 'lazy');
    });

    it('should render an initials fallback when no photo is provided', () => {
      render(<Testimonial quote="Q" author="Jordan Lee" />);
      const fallback = screen.getByTestId('testimonial-avatar-fallback');
      expect(fallback).toHaveTextContent('JL');
      expect(screen.queryByTestId('testimonial-avatar-image')).not.toBeInTheDocument();
    });

    it('should derive initials from up to the first two words', () => {
      render(<Testimonial quote="Q" author="Mary Jane Watson" />);
      expect(screen.getByTestId('testimonial-avatar-fallback')).toHaveTextContent('MJ');
    });

    it('should give a single-word author a single initial', () => {
      render(<Testimonial quote="Q" author="Cher" />);
      expect(screen.getByTestId('testimonial-avatar-fallback')).toHaveTextContent('C');
    });
  });

  // =========================================================================
  // Variants
  // =========================================================================

  describe('Variants', () => {
    it('should default to the single variant', () => {
      render(<Testimonial quote="Q" author="A" />);
      expect(screen.getByTestId('testimonial')).toHaveAttribute('data-variant', 'single');
    });

    it.each(['single', 'highlighted', 'compact'] as const)(
      'should expose the %s variant',
      (variant) => {
        render(<Testimonial quote="Q" author="A" variant={variant} />);
        expect(screen.getByTestId('testimonial')).toHaveAttribute('data-variant', variant);
      },
    );

    it('should apply distinct quote styling to the highlighted variant', () => {
      const { rerender } = render(<Testimonial quote="Q" author="A" variant="single" />);
      const single = screen.getByTestId('testimonial').querySelector('blockquote')?.className;
      rerender(<Testimonial quote="Q" author="A" variant="highlighted" />);
      const highlighted = screen.getByTestId('testimonial').querySelector('blockquote')?.className;
      expect(single).not.toEqual(highlighted);
    });
  });

  // =========================================================================
  // Rating (fractional)
  // =========================================================================

  describe('Rating', () => {
    it('should render the rating when provided', () => {
      render(<Testimonial quote="Q" author="A" rating={4} />);
      expect(screen.getByTestId('rating')).toBeInTheDocument();
    });

    it('should render the correct number of star glyphs for the max', () => {
      render(<Testimonial quote="Q" author="A" rating={3} ratingMax={5} />);
      // Each row (empty + filled) draws exactly `max` star SVGs.
      expect(screen.getByTestId('rating-empty').querySelectorAll('svg')).toHaveLength(5);
      expect(screen.getByTestId('rating-filled').querySelectorAll('svg')).toHaveLength(5);
      expect(screen.getByTestId('rating')).toHaveAttribute('data-max', '5');
    });

    it('should expose a whole-number rating via an accessible label', () => {
      render(<StarRating value={4} />);
      expect(screen.getByRole('img', { name: '4 out of 5 stars' })).toBeInTheDocument();
    });

    it('should fill 80% for a rating of 4 out of 5', () => {
      render(<StarRating value={4} max={5} />);
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '80%' });
    });

    it('should support a fractional rating with a half-star fill and exact label', () => {
      render(<StarRating value={4.5} max={5} />);
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '90%' });
      expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument();
    });

    it('should round to the nearest half star', () => {
      render(<StarRating value={4.3} max={5} />);
      // 4.3 rounds to 4.5 → 90%.
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '90%' });
      expect(screen.getByRole('img', { name: '4.5 out of 5 stars' })).toBeInTheDocument();
    });

    it('should clamp a value above the max', () => {
      render(<StarRating value={7} max={5} />);
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '100%' });
      expect(screen.getByRole('img', { name: '5 out of 5 stars' })).toBeInTheDocument();
    });

    it('should clamp a negative value to zero', () => {
      render(<StarRating value={-2} max={5} />);
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '0%' });
      expect(screen.getByRole('img', { name: '0 out of 5 stars' })).toBeInTheDocument();
    });

    it('should honour a custom max', () => {
      render(<StarRating value={7} max={10} />);
      expect(screen.getByTestId('rating-fill')).toHaveStyle({ width: '70%' });
      expect(screen.getByRole('img', { name: '7 out of 10 stars' })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations for the default testimonial', async () => {
      const { container } = render(
        <Testimonial
          quote="A genuinely excellent product."
          author="Jordan Lee"
          authorRole="Head of Operations"
          company="Northwind"
          image={PHOTO}
          imageAlt="Jordan Lee"
          rating={4.5}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for the highlighted variant', async () => {
      const { container } = render(
        <Testimonial quote="Q" author="A" company="Lumen" rating={5} variant="highlighted" />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations with the fallback avatar', async () => {
      const { container } = render(
        <Testimonial quote="Q" author="Priya Nair" authorRole="CTO" company="Lumen" />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default variant', () => {
      const { container } = render(
        <Testimonial
          quote="A genuinely excellent product."
          author="Jordan Lee"
          authorRole="Head of Operations"
          company="Northwind"
          image={PHOTO}
          imageAlt="Jordan Lee"
          rating={4.5}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the highlighted variant', () => {
      const { container } = render(
        <Testimonial quote="Q" author="A" company="Lumen" rating={5} variant="highlighted" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the compact variant with the fallback avatar', () => {
      const { container } = render(
        <Testimonial quote="Q" author="Priya Nair" authorRole="CTO" variant="compact" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
