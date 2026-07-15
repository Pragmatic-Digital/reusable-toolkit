import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { Button } from '../ui/button';

/** Which side the image sits on at desktop widths. */
export type ImageTextPosition = 'left' | 'right';

/**
 * Image treatment. `contained` sits the image in a rounded box at the set
 * aspect ratio; `full-bleed` fills its half edge-to-edge with no rounding.
 */
export type ImageTextLayout = 'contained' | 'full-bleed';

/** Which block appears first when stacked on mobile. */
export type ImageTextMobileOrder = 'image-first' | 'text-first';

/** Text alignment within the text column. */
export type ImageTextAlign = 'left' | 'center';

/** CTA button variants, mapped onto the underlying Button primitive. */
export type ImageTextCtaVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';

/**
 * Call-to-action. Generic on purpose: pass `href` for navigation or `onClick`
 * for an action. Passing `href` renders an anchor.
 */
export interface ImageTextCta {
  /** Visible label */
  label: string;
  /** Destination. When set, renders an anchor. */
  href?: string;
  /** Click handler. Renders a button when there is no `href`. */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** Styling variant. Defaults to `primary`. */
  variant?: ImageTextCtaVariant;
  /** Anchor target, e.g. `_blank` */
  target?: React.HTMLAttributeAnchorTarget;
  /** Anchor rel. Defaults to `noopener noreferrer` when `target="_blank"`. */
  rel?: string;
  /** Accessible name, when the label lacks context */
  ariaLabel?: string;
}

export interface ImageTextProps {
  /** Image URL — CMS-provided or a static asset. Required. */
  image: string;
  /** Alt text. Empty string (default) marks the image decorative. */
  imageAlt?: string;
  /** Section heading. The only required text. */
  title: string;
  /** Supporting copy below the heading */
  description?: ReactNode;
  /** Small label above the heading, e.g. "OUR PROCESS" */
  overline?: ReactNode;
  /** Call-to-action below the text */
  cta?: ImageTextCta;
  /** Which side the image sits on at desktop. Defaults to `left`. */
  imagePosition?: ImageTextPosition;
  /** Image treatment. Defaults to `contained`. */
  layout?: ImageTextLayout;
  /** Which block appears first when stacked on mobile. Defaults to `image-first`. */
  mobileOrder?: ImageTextMobileOrder;
  /** CSS aspect-ratio for the image, e.g. `16 / 9`, `1 / 1`, `3 / 4`. Defaults to `4 / 3`. */
  aspectRatio?: string;
  /** CSS `object-position` for the image */
  imageObjectPosition?: string;
  /** Text alignment within the text column. Defaults to `left`. */
  textAlign?: ImageTextAlign;
  /**
   * Heading level. Defaults to 2 — an ImageText is a page section. Set
   * explicitly to keep the document outline correct.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Accessible name for the section. Defaults to the title. */
  ariaLabel?: string;
  /** Additional classes on the section element */
  className?: string;
}

const ctaVariantMap: Record<ImageTextCtaVariant, 'default' | 'secondary' | 'outline' | 'ghost' | 'link'> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
  link: 'link',
};

const textAlignClasses: Record<ImageTextAlign, string> = {
  left: 'text-left items-start',
  center: 'text-center items-center',
};

/**
 * ImageText
 *
 * A side-by-side image and text section for about blocks, process steps and
 * feature explanations. The two columns stack on mobile in a configurable
 * order; the image side, its aspect ratio and its treatment (contained vs
 * full-bleed) are all prop-driven. Renders cleanly with just an image and title.
 *
 * The desktop column order is set with CSS `order`, so `imagePosition` never
 * affects the source/DOM order — the mobile stack order stays independent and
 * predictable for assistive tech.
 *
 * @example
 * ```tsx
 * <ImageText
 *   image={cms.image.url}
 *   imageAlt="Our team at work"
 *   overline="Our process"
 *   title="From idea to launch"
 *   description="How we work with you at every stage."
 *   cta={{ label: 'Learn more', href: '/process' }}
 *   imagePosition="right"
 *   aspectRatio="16 / 9"
 * />
 * ```
 */
export const ImageText = React.forwardRef<HTMLElement, ImageTextProps>(
  (
    {
      image,
      imageAlt = '',
      title,
      description,
      overline,
      cta,
      imagePosition = 'left',
      layout = 'contained',
      mobileOrder = 'image-first',
      aspectRatio = '4 / 3',
      imageObjectPosition,
      textAlign = 'left',
      headingLevel = 2,
      ariaLabel,
      className,
    },
    ref,
  ) => {
    const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    // DOM order follows the mobile stack order; desktop order is set with CSS,
    // so imagePosition never reorders the source for screen readers.
    const imageFirstInDom = mobileOrder === 'image-first';

    // At desktop, place the image on the requested side via `order`.
    const imageDesktopOrder = imagePosition === 'left' ? 'md:order-1' : 'md:order-2';
    const textDesktopOrder = imagePosition === 'left' ? 'md:order-2' : 'md:order-1';

    const imageBlock = (
      <div
        data-testid="imagetext-image-col"
        className={clsx('w-full', imageDesktopOrder, imageFirstInDom ? 'order-1' : 'order-2')}
      >
        <div
          data-testid="imagetext-image-frame"
          data-layout={layout}
          className={clsx(
            'relative w-full overflow-hidden bg-slate-100',
            layout === 'contained' ? 'rounded-2xl' : 'md:h-full',
          )}
          style={{ aspectRatio: layout === 'contained' ? aspectRatio : undefined }}
        >
          <img
            src={image}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : true}
            loading="lazy"
            data-testid="imagetext-image"
            className={clsx(
              'h-full w-full object-cover',
              // Full-bleed still needs a minimum height when the text is short.
              layout === 'full-bleed' && 'min-h-[16rem]',
            )}
            style={{
              objectPosition: imageObjectPosition,
              aspectRatio: layout === 'full-bleed' ? aspectRatio : undefined,
            }}
          />
        </div>
      </div>
    );

    const textBlock = (
      <div
        data-testid="imagetext-text-col"
        className={clsx(
          'flex w-full flex-col justify-center',
          textAlignClasses[textAlign],
          textDesktopOrder,
          imageFirstInDom ? 'order-2' : 'order-1',
          layout === 'full-bleed' && 'py-8 md:px-4',
        )}
      >
        {overline && (
          <p
            data-testid="imagetext-overline"
            className="mb-3 text-sm font-semibold uppercase tracking-wide text-indigo-600"
          >
            {overline}
          </p>
        )}

        <Heading className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</Heading>

        {description && (
          <div data-testid="imagetext-description" className="mt-4 text-base text-slate-600 sm:text-lg">
            {description}
          </div>
        )}

        {cta && <ImageTextCtaButton cta={cta} align={textAlign} />}
      </div>
    );

    return (
      <section
        ref={ref}
        aria-label={ariaLabel ?? title}
        data-testid="imagetext"
        data-image-position={imagePosition}
        data-layout={layout}
        data-mobile-order={mobileOrder}
        data-text-align={textAlign}
        className={clsx(
          'grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12',
          layout === 'full-bleed' && 'md:items-stretch md:gap-0',
          className,
        )}
      >
        {imageFirstInDom ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </section>
    );
  },
);

ImageText.displayName = 'ImageText';

/** Renders the CTA as an anchor (when `href`) or a button, via the Button primitive. */
const ImageTextCtaButton = ({ cta, align }: { cta: ImageTextCta; align: ImageTextAlign }) => {
  const variant = cta.variant ?? 'primary';
  const shared = {
    variant: ctaVariantMap[variant],
    onClick: cta.onClick,
    'aria-label': cta.ariaLabel,
    'data-variant': variant,
    'data-testid': 'imagetext-cta',
  };

  return (
    <div className={clsx('mt-6', align === 'center' && 'flex justify-center')}>
      {cta.href ? (
        <Button asChild {...shared}>
          <a
            href={cta.href}
            target={cta.target}
            rel={cta.rel ?? (cta.target === '_blank' ? 'noopener noreferrer' : undefined)}
          >
            {cta.label}
          </a>
        </Button>
      ) : (
        <Button {...shared}>{cta.label}</Button>
      )}
    </div>
  );
};
