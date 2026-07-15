import React, { ReactNode, useState } from 'react';
import { clsx } from 'clsx';

/** Visual variant. Driven by a single prop so new variants are one-line additions. */
export type TestimonialVariant = 'single' | 'highlighted' | 'compact';

export interface StarRatingProps {
  /** Rating value. Supports fractions, e.g. 4.5. Clamped to 0…max. */
  value: number;
  /** Maximum rating. Defaults to 5. */
  max?: number;
  /** Pixel size of each star. Defaults to 18. */
  size?: number;
  /** Additional classes */
  className?: string;
}

export interface TestimonialProps {
  /** The quote text. Required. */
  quote: ReactNode;
  /** Author name. Required. */
  author: string;
  /** Company or organisation */
  company?: string;
  /** Author's role/title, distinct from company */
  authorRole?: string;
  /** Author photo URL — CMS or static asset. Falls back to initials when absent. */
  image?: string;
  /** Alt text for the author photo. Defaults to the author's name. */
  imageAlt?: string;
  /** Star rating. Supports fractions (e.g. 4.5). Omit to render no rating. */
  rating?: number;
  /** Maximum rating. Defaults to 5. */
  ratingMax?: number;
  /** Visual variant. Defaults to `single`. */
  variant?: TestimonialVariant;
  /** Additional classes on the root element */
  className?: string;
}

const STAR_PATH =
  'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.9 6.1 21l1.2-6.5L2.5 9.9l6.6-.9L12 2.5z';

/** Rounds to the nearest half, so a fractional value snaps to a half-star fill. */
const roundToHalf = (value: number): number => Math.round(value * 2) / 2;

/** Formats a rating for a screen reader, dropping a trailing `.0`. */
const formatRating = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(1);

/**
 * StarRating
 *
 * A fractional star rating. Renders an empty row of stars with a clipped filled
 * row on top, so any partial value displays correctly. The whole control has a
 * single accessible label (e.g. "4.5 out of 5 stars"); the stars themselves are
 * decorative. Exported so it can be reused independently.
 */
export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ value, max = 5, size = 18, className }, ref) => {
    const clamped = Math.min(Math.max(value, 0), max);
    const displayed = roundToHalf(clamped);
    const fillPercent = (displayed / max) * 100;
    const label = `${formatRating(displayed)} out of ${max} stars`;

    const row = (filled: boolean, testId: string) => (
      <div data-testid={testId} className="flex" style={{ color: filled ? undefined : '#cbd5e1' }}>
        {Array.from({ length: max }, (_, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? 'currentColor' : '#cbd5e1'}
            aria-hidden="true"
            className={filled ? 'text-amber-400' : ''}
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
    );

    return (
      <div
        ref={ref}
        role="img"
        aria-label={label}
        data-testid="rating"
        data-value={displayed}
        data-max={max}
        className={clsx('relative inline-flex', className)}
      >
        {row(false, 'rating-empty')}
        {/* Filled row clipped to the fill percentage — this is the partial star. */}
        <div
          data-testid="rating-fill"
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          {row(true, 'rating-filled')}
        </div>
      </div>
    );
  },
);

StarRating.displayName = 'StarRating';

const variantRootClasses: Record<TestimonialVariant, string> = {
  single: 'rounded-xl border border-slate-200 bg-white p-6',
  highlighted: 'rounded-2xl bg-slate-900 p-8 shadow-xl',
  compact: 'rounded-lg border border-slate-200 bg-white p-4',
};

const variantQuoteClasses: Record<TestimonialVariant, string> = {
  single: 'text-lg text-slate-800',
  highlighted: 'text-xl font-medium text-white sm:text-2xl',
  compact: 'text-sm text-slate-700',
};

const variantAuthorClasses: Record<TestimonialVariant, string> = {
  single: 'text-slate-900',
  highlighted: 'text-white',
  compact: 'text-slate-900',
};

const variantMetaClasses: Record<TestimonialVariant, string> = {
  single: 'text-slate-500',
  highlighted: 'text-slate-300',
  compact: 'text-slate-500',
};

const avatarSizeClasses: Record<TestimonialVariant, string> = {
  single: 'h-11 w-11 text-sm',
  highlighted: 'h-14 w-14 text-base',
  compact: 'h-8 w-8 text-xs',
};

/** First letters of the first two words, for the fallback avatar. */
const initialsFrom = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');

/** Joins role and company as "Role, Company", omitting whichever is absent. */
const metaLine = (authorRole?: string, company?: string): string =>
  [authorRole, company].filter(Boolean).join(', ');

/**
 * Testimonial
 *
 * A social-proof quote with author attribution, optional photo and optional
 * fractional star rating, in one of three variants. Uses semantic
 * figure/blockquote/figcaption markup. Renders cleanly with just a quote and an
 * author. Stays independently usable outside a carousel.
 *
 * @example
 * ```tsx
 * <Testimonial
 *   quote="This tool paid for itself in a week."
 *   author="Jordan Lee"
 *   authorRole="Head of Ops"
 *   company="Northwind"
 *   image={cms.avatar.url}
 *   rating={4.5}
 *   variant="highlighted"
 * />
 * ```
 */
export const Testimonial = React.forwardRef<HTMLElement, TestimonialProps>(
  (
    {
      quote,
      author,
      company,
      authorRole,
      image,
      imageAlt,
      rating,
      ratingMax = 5,
      variant = 'single',
      className,
    },
    ref,
  ) => {
    // Falls back to initials when the photo is missing or fails to load.
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = Boolean(image) && !imageFailed;
    const meta = metaLine(authorRole, company);

    return (
      <figure
        ref={ref}
        data-testid="testimonial"
        data-variant={variant}
        className={clsx('flex flex-col', variantRootClasses[variant], className)}
      >
        {rating !== undefined && (
          <StarRating
            value={rating}
            max={ratingMax}
            size={variant === 'compact' ? 14 : 18}
            className="mb-3"
          />
        )}

        <blockquote className={clsx('flex-1', variantQuoteClasses[variant])}>
          {/* String quotes get quotation marks; nodes are rendered as-is. */}
          {typeof quote === 'string' ? <p>{`“${quote}”`}</p> : quote}
        </blockquote>

        <figcaption className={clsx('mt-4 flex items-center gap-3', variant === 'compact' && 'mt-3')}>
          {showImage ? (
            <img
              src={image}
              alt={imageAlt ?? author}
              loading="lazy"
              onError={() => setImageFailed(true)}
              data-testid="testimonial-avatar-image"
              className={clsx('shrink-0 rounded-full object-cover', avatarSizeClasses[variant])}
            />
          ) : (
            <span
              aria-hidden="true"
              data-testid="testimonial-avatar-fallback"
              className={clsx(
                'inline-flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600',
                avatarSizeClasses[variant],
              )}
            >
              {initialsFrom(author)}
            </span>
          )}

          <div className="flex flex-col">
            <span
              data-testid="testimonial-author"
              className={clsx('font-semibold', variantAuthorClasses[variant])}
            >
              {author}
            </span>
            {meta && (
              <span
                data-testid="testimonial-meta"
                className={clsx('text-sm', variantMetaClasses[variant])}
              >
                {meta}
              </span>
            )}
          </div>
        </figcaption>
      </figure>
    );
  },
);

Testimonial.displayName = 'Testimonial';
