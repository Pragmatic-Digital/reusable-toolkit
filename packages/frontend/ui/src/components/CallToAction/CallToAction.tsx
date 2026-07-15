import React, { CSSProperties, ReactNode, useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/button';

/** Horizontal text alignment inside the content block. */
export type CallToActionAlignment = 'left' | 'center' | 'right';

/** Where the content block sits within the section. */
export type CallToActionContentPosition = 'left' | 'center' | 'right';

/** Button styling variants, mapped onto the underlying Button primitive. */
export type CallToActionButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

/**
 * A single CTA button. Deliberately generic: consumers describe *what* the
 * button is, not which component renders it. Pass `href` for navigation or
 * `onClick` for an action — passing `href` renders an anchor.
 */
export interface CallToActionButton {
  /** Visible button label */
  label: string;
  /** URL to navigate to. When set, the button renders as an anchor. */
  href?: string;
  /** Click handler. Can be combined with `href` (e.g. analytics). */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Styling variant (defaults to `primary` for the first button, `outline` for the rest) */
  variant?: CallToActionButtonVariant;
  /** Anchor target, e.g. `_blank`. `rel` is defaulted safely when `_blank`. */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel. Defaults to `noopener noreferrer` when `target="_blank"`. */
  rel?: string;
  /** Disables the button (ignored for anchors, which cannot be disabled) */
  disabled?: boolean;
  /** Accessible label, when the visible label lacks context */
  ariaLabel?: string;
}

/** One `<source>` entry for a video background. */
export interface CallToActionVideoSource {
  src: string;
  /** MIME type, e.g. `video/webm` */
  type?: string;
}

/**
 * Overlay drawn between the background and the content, for contrast.
 * Provide the prop to enable it; omit it entirely to render no overlay.
 */
export interface CallToActionOverlay {
  /** Any CSS colour value, including `var(--token)`. Defaults to black. */
  colour?: string;
  /** 0–1. Defaults to 0.5. */
  opacity?: number;
  /** Escape hatch for gradient/scrim overlays via utility classes */
  className?: string;
}

/** Solid colour background. Accepts any CSS colour, including theme tokens. */
export interface CallToActionColourBackground {
  type: 'colour';
  /** e.g. `#0f172a`, `rgb(...)`, `var(--brand-surface)` */
  colour: string;
}

/** Gradient background. Accepts any CSS gradient function. */
export interface CallToActionGradientBackground {
  type: 'gradient';
  /** e.g. `linear-gradient(90deg, var(--from), var(--to))` */
  gradient: string;
}

/** Image background from any source — CMS URL, static import, or data URI. */
export interface CallToActionImageBackground {
  type: 'image';
  src: string;
  /**
   * Alt text. Leave unset for decorative backgrounds (the default), which
   * hides the image from assistive tech.
   */
  alt?: string;
  /** CSS `object-position`, e.g. `top`, `50% 20%` */
  position?: string;
  /** Defaults to `lazy`; use `eager` for above-the-fold CTAs. */
  loading?: 'eager' | 'lazy';
}

/** Video background. Always muted and inline; never autoplays with sound. */
export interface CallToActionVideoBackground {
  type: 'video';
  /** A single URL, or multiple sources for format fallback */
  src: string | CallToActionVideoSource[];
  /** Poster image, shown before playback and when motion is reduced */
  poster?: string;
  /** Defaults to true. Suppressed when the user prefers reduced motion. */
  autoPlay?: boolean;
  /** Defaults to true */
  loop?: boolean;
  /** CSS `object-position` */
  position?: string;
}

export type CallToActionBackground =
  | CallToActionColourBackground
  | CallToActionGradientBackground
  | CallToActionImageBackground
  | CallToActionVideoBackground;

export interface CallToActionProps {
  /** Section heading. The only required prop. */
  title: string;
  /** Supporting copy below the heading */
  description?: ReactNode;
  /** Small label rendered above the heading */
  eyebrow?: ReactNode;
  /** One or more CTA buttons */
  buttons?: CallToActionButton[];
  /** Background to render behind the content. Defaults to a neutral surface. */
  background?: CallToActionBackground;
  /** Overlay for contrast. Omit for no overlay. */
  overlay?: CallToActionOverlay;
  /** Text alignment within the content block */
  alignment?: CallToActionAlignment;
  /** Where the content block sits within the section */
  contentPosition?: CallToActionContentPosition;
  /**
   * Colour scheme for text. Defaults to `light` over media/gradient
   * backgrounds and `dark` over solid colours.
   */
  tone?: 'light' | 'dark';
  /**
   * Heading level. Defaults to 2 — a CTA is a section within a page, not the
   * page title. Set explicitly to keep the document outline correct.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Minimum section height, as any CSS length. Defaults to `auto`. */
  minHeight?: number | string;
  /** Constrains the content block width. Defaults to `42rem`. */
  contentMaxWidth?: number | string;
  /** Accessible name for the section. Defaults to the title. */
  ariaLabel?: string;
  /** Additional classes on the section element */
  className?: string;
  /** Replaces the default title/description/buttons content entirely */
  children?: ReactNode;
}

const alignmentTextClasses: Record<CallToActionAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const alignmentItemsClasses: Record<CallToActionAlignment, string> = {
  left: 'items-start',
  center: 'items-center',
  right: 'items-end',
};

const alignmentJustifyClasses: Record<CallToActionAlignment, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const contentPositionClasses: Record<CallToActionContentPosition, string> = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto',
};

const toneTitleClasses = {
  light: 'text-white',
  dark: 'text-slate-900',
} as const;

const toneBodyClasses = {
  light: 'text-slate-100',
  dark: 'text-slate-600',
} as const;

const toneEyebrowClasses = {
  light: 'text-slate-200',
  dark: 'text-slate-500',
} as const;

const buttonVariantMap: Record<CallToActionButtonVariant, 'default' | 'secondary' | 'outline' | 'ghost' | 'link'> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
};

const DEFAULT_BACKGROUND: CallToActionBackground = {
  type: 'colour',
  colour: '#f1f5f9',
};

const DEFAULT_OVERLAY_COLOUR = '#000000';
const DEFAULT_OVERLAY_OPACITY = 0.5;

/** Media backgrounds and gradients read as dark by default, so text goes light. */
const defaultToneFor = (background: CallToActionBackground): 'light' | 'dark' =>
  background.type === 'colour' ? 'dark' : 'light';

/**
 * Tracks `prefers-reduced-motion`. Guarded for SSR and for test environments
 * where `matchMedia` may be absent.
 */
const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);

    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefersReducedMotion;
};

const videoSources = (src: CallToActionVideoBackground['src']): CallToActionVideoSource[] =>
  typeof src === 'string' ? [{ src }] : src;

/**
 * CallToAction
 *
 * A flexible CTA section for the end of content blocks and promotional spots.
 * Backgrounds are a discriminated union, so a colour, gradient, image or video
 * can be passed interchangeably without the caller branching on type.
 *
 * @example
 * ```tsx
 * <CallToAction
 *   title="Ready to get started?"
 *   description="Talk to us about your next project."
 *   background={{ type: 'image', src: cmsImage.url }}
 *   overlay={{ opacity: 0.6 }}
 *   alignment="left"
 *   contentPosition="left"
 *   buttons={[
 *     { label: 'Book a call', href: '/contact' },
 *     { label: 'See our work', href: '/work', variant: 'outline' },
 *   ]}
 * />
 * ```
 */
export const CallToAction = React.forwardRef<HTMLElement, CallToActionProps>(
  (
    {
      title,
      description,
      eyebrow,
      buttons,
      background = DEFAULT_BACKGROUND,
      overlay,
      alignment = 'center',
      contentPosition = 'center',
      tone,
      headingLevel = 2,
      minHeight,
      contentMaxWidth = '42rem',
      ariaLabel,
      className,
      children,
    },
    ref,
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const resolvedTone = tone ?? defaultToneFor(background);
    const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    const sectionStyle: CSSProperties = {
      ...(minHeight !== undefined && { minHeight }),
      ...(background.type === 'colour' && { backgroundColor: background.colour }),
      ...(background.type === 'gradient' && { backgroundImage: background.gradient }),
    };

    const hasButtons = Boolean(buttons && buttons.length > 0);

    return (
      <section
        ref={ref}
        aria-label={ariaLabel ?? title}
        data-background-type={background.type}
        data-alignment={alignment}
        data-content-position={contentPosition}
        className={clsx('relative isolate w-full overflow-hidden', className)}
        style={sectionStyle}
      >
        {background.type === 'image' && (
          <img
            src={background.src}
            alt={background.alt ?? ''}
            aria-hidden={background.alt ? undefined : true}
            loading={background.loading ?? 'lazy'}
            data-testid="cta-background-image"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            style={{ objectPosition: background.position }}
          />
        )}

        {background.type === 'video' && (
          <video
            // Muted + playsInline are non-negotiable: a background video must
            // never autoplay with sound, and iOS refuses inline playback otherwise.
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            poster={background.poster}
            loop={background.loop ?? true}
            autoPlay={(background.autoPlay ?? true) && !prefersReducedMotion}
            data-testid="cta-background-video"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            style={{ objectPosition: background.position }}
          >
            {videoSources(background.src).map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        )}

        {overlay && (
          <div
            aria-hidden="true"
            data-testid="cta-overlay"
            className={clsx('absolute inset-0 -z-10', overlay.className)}
            style={{
              backgroundColor: overlay.colour ?? DEFAULT_OVERLAY_COLOUR,
              opacity: overlay.opacity ?? DEFAULT_OVERLAY_OPACITY,
            }}
          />
        )}

        <div className="relative flex w-full px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div
            data-testid="cta-content"
            className={clsx(
              'flex w-full flex-col',
              contentPositionClasses[contentPosition],
              alignmentItemsClasses[alignment],
              alignmentTextClasses[alignment],
            )}
            style={{ maxWidth: contentMaxWidth }}
          >
            {children ?? (
              <>
                {eyebrow && (
                  <p
                    className={clsx(
                      'mb-3 text-sm font-semibold uppercase tracking-wide',
                      toneEyebrowClasses[resolvedTone],
                    )}
                  >
                    {eyebrow}
                  </p>
                )}

                <Heading
                  className={clsx(
                    'text-balance text-3xl font-bold sm:text-4xl lg:text-5xl',
                    toneTitleClasses[resolvedTone],
                  )}
                >
                  {title}
                </Heading>

                {description && (
                  <p
                    className={clsx(
                      'mt-4 text-pretty text-base sm:text-lg',
                      toneBodyClasses[resolvedTone],
                    )}
                  >
                    {description}
                  </p>
                )}

                {hasButtons && (
                  <div
                    role="group"
                    aria-label="Call to action buttons"
                    data-testid="cta-buttons"
                    className={clsx(
                      'mt-8 flex flex-wrap gap-3',
                      alignmentJustifyClasses[alignment],
                    )}
                  >
                    {buttons?.map((button, index) => {
                      // First button reads as the primary action unless told otherwise.
                      const variant = button.variant ?? (index === 0 ? 'primary' : 'outline');
                      const shared = {
                        variant: buttonVariantMap[variant],
                        onClick: button.onClick,
                        'aria-label': button.ariaLabel,
                        // Surfaces the resolved variant for styling hooks and tests,
                        // so neither has to reach into the Button primitive's classes.
                        'data-variant': variant,
                      };

                      if (button.href) {
                        const target = button.target;
                        return (
                          <Button key={button.label} asChild {...shared}>
                            <a
                              href={button.href}
                              target={target}
                              rel={button.rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
                            >
                              {button.label}
                            </a>
                          </Button>
                        );
                      }

                      return (
                        <Button key={button.label} disabled={button.disabled} {...shared}>
                          {button.label}
                        </Button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    );
  },
);

CallToAction.displayName = 'CallToAction';
