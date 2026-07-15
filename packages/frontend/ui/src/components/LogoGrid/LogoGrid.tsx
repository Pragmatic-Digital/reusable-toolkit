import React from 'react';
import { clsx } from 'clsx';

/** Columns at the largest breakpoint. Collapses on smaller screens. */
export type LogoGridColumns = 2 | 3 | 4 | 5 | 6;

/**
 * Hover treatment. `grayscale` desaturates by default and restores colour on
 * hover; the others fade or scale. `none` disables the effect (logos in colour).
 */
export type LogoHoverEffect = 'grayscale' | 'opacity' | 'scale' | 'none';

/** A single logo. Works with CMS URLs or static assets, SVG or raster. */
export interface Logo {
  /** Image URL — SVG or raster, CMS-provided or a static import */
  src: string;
  /** Logo name / alt text. Required for an accessible name. */
  alt: string;
  /** Optional destination. Only used when `showLinks` is true. */
  href?: string;
  /** Per-logo width override (px), for logos that need more horizontal room */
  width?: number;
}

export interface LogoGridProps {
  /** Logos to render */
  logos: Logo[];
  /** Columns at the largest breakpoint. Defaults to 4. */
  columns?: LogoGridColumns;
  /** Fixed height of each logo box in pixels. Defaults to 48. */
  maxHeight?: number;
  /** Wrap logos with a link in an anchor. Defaults to true. */
  showLinks?: boolean;
  /** Hover treatment. Defaults to `grayscale`. */
  hoverEffect?: LogoHoverEffect;
  /** Grid gap token. Defaults to `md`. */
  gap?: 'sm' | 'md' | 'lg';
  /** Anchor target for linked logos. Defaults to `_blank` (external). */
  linkTarget?: '_blank' | '_self';
  /** Accessible label for the grid, e.g. "Our partners" */
  ariaLabel?: string;
  /** Additional classes on the grid container */
  className?: string;
}

/**
 * Column classes as complete static strings, so Tailwind's scanner sees them.
 * Every variant starts at 2 columns on the smallest screens.
 */
const columnClasses: Record<LogoGridColumns, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
} as const;

/**
 * Hover classes. Tailwind's `hover:` variants only apply under
 * `@media (hover: hover)`, so touch devices never get a stuck hover state.
 */
const hoverEffectClasses: Record<LogoHoverEffect, string> = {
  grayscale: 'grayscale opacity-80 transition duration-200 hover:grayscale-0 hover:opacity-100',
  opacity: 'opacity-60 transition-opacity duration-200 hover:opacity-100',
  scale: 'transition-transform duration-200 hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none',
  none: '',
};

/**
 * LogoGrid
 *
 * A responsive grid of logos for client listings, partner sections and
 * integration showcases. Every logo renders at a consistent height regardless
 * of its source dimensions (object-fit within a fixed-height box), so wildly
 * different client files line up without distortion.
 *
 * @example
 * ```tsx
 * <LogoGrid
 *   columns={5}
 *   ariaLabel="Our partners"
 *   logos={[
 *     { src: acme.url, alt: 'Acme', href: 'https://acme.example' },
 *     { src: '/logos/globex.svg', alt: 'Globex' },
 *   ]}
 * />
 * ```
 */
export const LogoGrid = React.forwardRef<HTMLUListElement, LogoGridProps>(
  (
    {
      logos,
      columns = 4,
      maxHeight = 48,
      showLinks = true,
      hoverEffect = 'grayscale',
      gap = 'md',
      linkTarget = '_blank',
      ariaLabel,
      className,
    },
    ref,
  ) => {
    // Nothing to render — avoid an empty grid box.
    if (logos.length === 0) return null;

    return (
      <ul
        ref={ref}
        role="list"
        aria-label={ariaLabel}
        data-testid="logo-grid"
        data-columns={columns}
        data-hover-effect={hoverEffect}
        className={clsx('grid list-none p-0', columnClasses[columns], gapClasses[gap], className)}
      >
        {logos.map((logo, index) => {
          const image = (
            <img
              src={logo.src}
              alt={logo.alt}
              loading="lazy"
              data-testid="logo-image"
              className={clsx('max-h-full w-auto object-contain', hoverEffectClasses[hoverEffect])}
              style={{ maxHeight, maxWidth: '100%', width: logo.width }}
            />
          );

          const isLinked = showLinks && Boolean(logo.href);
          const opensNewTab = isLinked && linkTarget === '_blank';

          return (
            <li key={`${logo.alt}-${index}`}>
              <div
                data-testid="logo-item"
                className="flex items-center justify-center"
                style={{ height: maxHeight }}
              >
                {isLinked ? (
                  <a
                    href={logo.href}
                    target={linkTarget}
                    // Security: external targets must not leak the opener.
                    rel={linkTarget === '_blank' ? 'noopener noreferrer' : undefined}
                    data-testid="logo-link"
                    className="inline-flex h-full items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  >
                    {image}
                    {/* Signals external navigation to screen readers. */}
                    {opensNewTab && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                ) : (
                  image
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  },
);

LogoGrid.displayName = 'LogoGrid';
