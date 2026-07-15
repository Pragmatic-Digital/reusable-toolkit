import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

/** Number of columns at the largest breakpoint. Collapses on smaller screens. */
export type FeatureGridColumns = 2 | 3 | 4;

/** Per-card arrangement. Add a variant here + in the class maps to extend. */
export type FeatureGridLayout = 'stacked' | 'horizontal';

/** Badge tone. Theme-driven classes rather than hardcoded colours. */
export type FeatureBadgeVariant = 'default' | 'accent' | 'muted' | 'outline';

/**
 * A single feature. Supply either an `icon` (any node — SVG, icon-font glyph,
 * or component) or an `image` URL; icons are treated as decorative, images take
 * alt text. `href` makes the whole card clickable via a stretched title link.
 */
export interface Feature {
  /** Feature heading */
  title: string;
  /** Supporting copy */
  description?: ReactNode;
  /** Decorative icon node — SVG, icon-font element, or component instance */
  icon?: ReactNode;
  /** Image URL — CMS-provided or a static asset. Ignored when `icon` is set. */
  image?: string;
  /** Alt text for `image`. Empty string (default) marks it decorative. */
  imageAlt?: string;
  /** Optional badge/tag. Takes no space when omitted. */
  badge?: ReactNode;
  /** Badge tone */
  badgeVariant?: FeatureBadgeVariant;
  /** Makes the card a link to this destination */
  href?: string;
  /** Anchor target for `href` */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel. Defaults to `noopener noreferrer` when `target="_blank"`. */
  rel?: string;
}

export interface FeatureCardProps {
  /** The feature to render */
  feature: Feature;
  /** Per-card arrangement. Defaults to `stacked`. */
  layout?: FeatureGridLayout;
  /** Heading level for the title. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Icon/image box size in pixels. Defaults to 48. */
  iconSize?: number;
  /** Additional classes on the card */
  className?: string;
}

export interface FeatureGridProps {
  /** Features to render */
  features: Feature[];
  /** Columns at the largest breakpoint. Defaults to 3. */
  columns?: FeatureGridColumns;
  /** Per-card arrangement, applied to every card. Defaults to `stacked`. */
  layout?: FeatureGridLayout;
  /** Grid gap token. Defaults to `md`. */
  gap?: 'sm' | 'md' | 'lg';
  /** Heading level for each feature title. Defaults to 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Icon/image box size in pixels, applied to every card. Defaults to 48. */
  iconSize?: number;
  /** Accessible label for the list, e.g. "Product features" */
  ariaLabel?: string;
  /** Additional classes on the grid container */
  className?: string;
}

/**
 * Column classes as complete static strings, so Tailwind's scanner sees them.
 * All variants collapse to a single column on the smallest screens.
 */
const columnClasses: Record<FeatureGridColumns, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
} as const;

const layoutCardClasses: Record<FeatureGridLayout, string> = {
  stacked: 'flex flex-col',
  horizontal: 'flex flex-row items-start gap-4',
};

const badgeVariantClasses: Record<FeatureBadgeVariant, string> = {
  default: 'bg-slate-900 text-white',
  accent: 'bg-indigo-600 text-white',
  muted: 'bg-slate-100 text-slate-700',
  outline: 'border border-slate-300 text-slate-700',
};

const resolveRel = (feature: Feature): string | undefined =>
  feature.rel ?? (feature.target === '_blank' ? 'noopener noreferrer' : undefined);

/**
 * FeatureCard
 *
 * A single feature tile. Exported so it can be reused on its own outside the
 * grid. Renders an icon or an image, a heading, an optional badge and a
 * description, in either a stacked or icon-left arrangement.
 */
export const FeatureCard = React.forwardRef<HTMLElement, FeatureCardProps>(
  ({ feature, layout = 'stacked', headingLevel = 3, iconSize = 48, className }, ref) => {
    const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const isLinked = Boolean(feature.href);

    const media = feature.icon ? (
      <span
        aria-hidden="true"
        data-testid="feature-icon"
        className="inline-flex shrink-0 items-center justify-center text-indigo-600"
        style={{ width: iconSize, height: iconSize }}
      >
        {feature.icon}
      </span>
    ) : feature.image ? (
      <img
        src={feature.image}
        alt={feature.imageAlt ?? ''}
        loading="lazy"
        data-testid="feature-image"
        className="shrink-0 rounded-md object-cover"
        style={{ width: iconSize, height: iconSize }}
      />
    ) : null;

    return (
      <article
        ref={ref}
        data-testid="feature-card"
        data-layout={layout}
        data-linked={isLinked || undefined}
        className={clsx(
          'group relative',
          layoutCardClasses[layout],
          isLinked &&
            'rounded-lg transition-shadow duration-200 hover:shadow-md focus-within:shadow-md',
          className,
        )}
      >
        {media && <div className={clsx(layout === 'stacked' && 'mb-4')}>{media}</div>}

        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            <Heading className="text-base font-semibold text-slate-900">
              {isLinked ? (
                <a
                  href={feature.href}
                  target={feature.target}
                  rel={resolveRel(feature)}
                  data-testid="feature-title-link"
                  // Stretched overlay makes the whole card clickable while
                  // keeping a single tab stop, named by the heading.
                  className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:underline"
                >
                  {feature.title}
                </a>
              ) : (
                feature.title
              )}
            </Heading>

            {feature.badge && (
              <span
                data-testid="feature-badge"
                data-variant={feature.badgeVariant ?? 'default'}
                className={clsx(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
                  badgeVariantClasses[feature.badgeVariant ?? 'default'],
                )}
              >
                {feature.badge}
              </span>
            )}
          </div>

          {feature.description && (
            <p data-testid="feature-description" className="mt-2 text-sm text-slate-600">
              {feature.description}
            </p>
          )}
        </div>
      </article>
    );
  },
);

FeatureCard.displayName = 'FeatureCard';

/**
 * FeatureGrid
 *
 * A responsive grid for showcasing product features, services or benefits. Each
 * feature carries an icon or image, a heading and a description, with an
 * optional per-feature badge. Column count and per-card layout are prop-driven;
 * breakpoint collapse is handled by the column classes, not scattered media
 * queries.
 *
 * @example
 * ```tsx
 * <FeatureGrid
 *   columns={3}
 *   ariaLabel="Product features"
 *   features={[
 *     { icon: <BoltIcon />, title: 'Fast', description: 'Sub-second loads.' },
 *     { image: cms.icon.url, imageAlt: '', title: 'Secure', description: 'SOC 2.' },
 *     { icon: <HeartIcon />, title: 'Loved', description: 'By your users.', badge: 'Popular' },
 *   ]}
 * />
 * ```
 */
export const FeatureGrid = React.forwardRef<HTMLUListElement, FeatureGridProps>(
  (
    {
      features,
      columns = 3,
      layout = 'stacked',
      gap = 'md',
      headingLevel = 3,
      iconSize = 48,
      ariaLabel,
      className,
    },
    ref,
  ) => {
    return (
      <ul
        ref={ref}
        // role="list" keeps list semantics even though list styling is removed.
        role="list"
        aria-label={ariaLabel}
        data-testid="feature-grid"
        data-columns={columns}
        data-layout={layout}
        className={clsx('grid list-none p-0', columnClasses[columns], gapClasses[gap], className)}
      >
        {features.map((feature, index) => (
          <li key={feature.href ?? `${feature.title}-${index}`}>
            <FeatureCard
              feature={feature}
              layout={layout}
              headingLevel={headingLevel}
              iconSize={iconSize}
            />
          </li>
        ))}
      </ul>
    );
  },
);

FeatureGrid.displayName = 'FeatureGrid';
