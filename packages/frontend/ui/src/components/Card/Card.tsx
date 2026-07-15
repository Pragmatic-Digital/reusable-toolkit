import React, { CSSProperties, ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/button';

/** Visual style of the footer action. */
export type CardActionVariant = 'link' | 'button';

/** Hover feedback style. Kept as a named token so the design system can swap it. */
export type CardHoverEffect = 'lift' | 'zoom' | 'border' | 'none';

/** Badge tone. Maps to theme-driven classes rather than hardcoded colours. */
export type CardBadgeVariant = 'default' | 'accent' | 'muted' | 'outline';

/**
 * Footer action — a "Read more", "View profile", etc. Generic on purpose:
 * pass `href` for navigation or `onClick` for an action. `variant` controls
 * whether it reads as a text link or a solid button.
 */
export interface CardAction {
  /** Visible label */
  label: string;
  /** Destination. When set, renders an anchor. */
  href?: string;
  /** Click handler. Renders a button when there is no `href`. */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** `link` (default) reads as text; `button` renders the Button primitive. */
  variant?: CardActionVariant;
  /** Anchor target, e.g. `_blank` */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel. Defaults to `noopener noreferrer` when `target="_blank"`. */
  rel?: string;
  /** Accessible name, when the label alone lacks context out of place */
  ariaLabel?: string;
}

export interface CardProps {
  /** Card heading. The only always-required content. */
  title: string;
  /** Image URL — CMS-provided or a static import. Omit for the no-image layout. */
  image?: string;
  /**
   * Alt text for the image. Describe the image for content cards; pass an empty
   * string only when the image is purely decorative. Defaults to empty.
   */
  imageAlt?: string;
  /** `loading` for the image. Defaults to `lazy`. */
  imageLoading?: 'eager' | 'lazy';
  /** CSS aspect-ratio for the image frame, keeping grids aligned. Defaults to `16 / 9`. */
  imageAspectRatio?: string;
  /** CSS `object-position` for the image */
  imageObjectPosition?: string;
  /** Supporting copy below the title */
  excerpt?: ReactNode;
  /** Optional badge/tag. Renders nothing (and takes no space) when omitted. */
  badge?: ReactNode;
  /** Badge tone */
  badgeVariant?: CardBadgeVariant;
  /** Footer action. Omit for a static card. */
  action?: CardAction;
  /**
   * When true, the whole card is clickable via a stretched overlay on the
   * title link — one tab stop, accessible name from the heading. Requires
   * `action.href`; ignored for action-less or onClick-only cards.
   */
  interactive?: boolean;
  /** Hover feedback. Defaults to `lift`. */
  hoverEffect?: CardHoverEffect;
  /**
   * Heading level for the title. Defaults to 3 — cards usually sit under a
   * section heading in a listing. Set explicitly to keep the outline correct.
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** Clamp the excerpt to N lines. Defaults to no clamp (natural wrap). */
  excerptLines?: number;
  /** Fallback content for the image area when no `image` is given */
  imageFallback?: ReactNode;
  /** Additional classes on the root element */
  className?: string;
  /** Escape hatch for arbitrary content between excerpt and footer */
  children?: ReactNode;
}

const badgeVariantClasses: Record<CardBadgeVariant, string> = {
  default: 'bg-slate-900 text-white',
  accent: 'bg-indigo-600 text-white',
  muted: 'bg-slate-100 text-slate-700',
  outline: 'border border-slate-300 text-slate-700',
};

/**
 * Hover classes. `group-hover:` targets are used so the whole card drives the
 * effect. Focus-within mirrors hover so keyboard users get the same feedback
 * without the effect swallowing the focus ring.
 */
const hoverRootClasses: Record<CardHoverEffect, string> = {
  lift: 'transition-shadow duration-200 hover:shadow-lg focus-within:shadow-lg',
  border:
    'transition-colors duration-200 hover:border-slate-400 focus-within:border-slate-400',
  zoom: 'transition-shadow duration-200 hover:shadow-md focus-within:shadow-md',
  none: '',
};

const hoverImageClasses: Record<CardHoverEffect, string> = {
  zoom: 'transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none',
  lift: '',
  border: '',
  none: '',
};

const resolveRel = (action: CardAction): string | undefined =>
  action.rel ?? (action.target === '_blank' ? 'noopener noreferrer' : undefined);

/**
 * Card
 *
 * A generic content card for listings — blog posts, team members, portfolio
 * items. Renders cleanly with just an image and title; excerpt, badge and
 * footer action are all optional. Layout-system agnostic, so it drops into any
 * grid without modification.
 *
 * @example
 * ```tsx
 * <Card
 *   image={post.hero.url}
 *   imageAlt={post.hero.alt}
 *   badge={post.category}
 *   title={post.title}
 *   excerpt={post.summary}
 *   action={{ label: 'Read more', href: post.url }}
 *   interactive
 * />
 * ```
 */
export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      title,
      image,
      imageAlt = '',
      imageLoading = 'lazy',
      imageAspectRatio = '16 / 9',
      imageObjectPosition,
      excerpt,
      badge,
      badgeVariant = 'default',
      action,
      interactive = false,
      hoverEffect = 'lift',
      headingLevel = 3,
      excerptLines,
      imageFallback,
      className,
      children,
    },
    ref,
  ) => {
    const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    // The stretched-link pattern only works with a real link destination.
    const isInteractive = interactive && Boolean(action?.href);

    const excerptStyle: CSSProperties | undefined =
      excerptLines !== undefined
        ? {
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: excerptLines,
            overflow: 'hidden',
          }
        : undefined;

    const renderTitle = () => {
      if (isInteractive && action?.href) {
        return (
          <Heading className="text-lg font-semibold text-slate-900">
            <a
              href={action.href}
              target={action.target}
              rel={resolveRel(action)}
              aria-label={action.ariaLabel}
              data-testid="card-title-link"
              // The ::after overlay makes the whole card the hit area. `static`
              // parents up to the relatively-positioned root are covered.
              className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:underline"
            >
              {title}
            </a>
          </Heading>
        );
      }

      return (
        <Heading className="text-lg font-semibold text-slate-900">{title}</Heading>
      );
    };

    const renderFooter = () => {
      if (!action) return null;

      // In interactive mode the whole card already links to the same place, so
      // the footer is a non-focusable visual affordance — no duplicate tab stop.
      if (isInteractive) {
        return (
          <div
            data-testid="card-footer"
            data-variant={action.variant ?? 'link'}
            aria-hidden="true"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
          >
            {action.label}
            <span aria-hidden="true">→</span>
          </div>
        );
      }

      const variant = action.variant ?? 'link';
      const commonProps = {
        'data-testid': 'card-footer',
        'data-variant': variant,
        'aria-label': action.ariaLabel,
        onClick: action.onClick,
      };

      if (variant === 'button') {
        if (action.href) {
          return (
            <Button asChild className="mt-4" {...commonProps}>
              <a href={action.href} target={action.target} rel={resolveRel(action)}>
                {action.label}
              </a>
            </Button>
          );
        }
        return (
          <Button className="mt-4" {...commonProps}>
            {action.label}
          </Button>
        );
      }

      // Link-style
      const linkClasses =
        'mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm';

      if (action.href) {
        return (
          <a
            href={action.href}
            target={action.target}
            rel={resolveRel(action)}
            className={linkClasses}
            {...commonProps}
          >
            {action.label}
            <span aria-hidden="true">→</span>
          </a>
        );
      }

      return (
        <button type="button" className={linkClasses} {...commonProps}>
          {action.label}
          <span aria-hidden="true">→</span>
        </button>
      );
    };

    return (
      <article
        ref={ref}
        data-testid="card"
        data-interactive={isInteractive || undefined}
        data-hover-effect={hoverEffect}
        className={clsx(
          'group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white',
          hoverRootClasses[hoverEffect],
          className,
        )}
      >
        <div
          data-testid="card-media"
          className="relative w-full overflow-hidden bg-slate-100"
          style={{ aspectRatio: imageAspectRatio }}
        >
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              loading={imageLoading}
              data-testid="card-image"
              className={clsx(
                'h-full w-full object-cover',
                hoverImageClasses[hoverEffect],
              )}
              style={{ objectPosition: imageObjectPosition }}
            />
          ) : (
            imageFallback ?? (
              <div
                aria-hidden="true"
                data-testid="card-image-placeholder"
                className="flex h-full w-full items-center justify-center text-slate-300"
              >
                <svg
                  className="h-10 w-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            )
          )}

          {badge && (
            <span
              data-testid="card-badge"
              data-variant={badgeVariant}
              className={clsx(
                'absolute left-3 top-3 z-10 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                badgeVariantClasses[badgeVariant],
              )}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          {renderTitle()}

          {excerpt && (
            <p
              data-testid="card-excerpt"
              className="mt-2 text-sm text-slate-600"
              style={excerptStyle}
            >
              {excerpt}
            </p>
          )}

          {children}

          {/* Footer sits at the bottom regardless of body length, for grid alignment. */}
          <div className="mt-auto">{renderFooter()}</div>
        </div>
      </article>
    );
  },
);

Card.displayName = 'Card';
