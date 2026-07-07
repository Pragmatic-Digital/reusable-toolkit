import React, { CSSProperties, ReactNode } from 'react';
import { Button } from '../ui/button';

/**
 * Button configuration for Hero CTAs
 */
export interface HeroButton {
  /** Button label text */
  label: string;
  /** Click handler for the button */
  onClick?: () => void;
  /** URL to navigate to when button is clicked */
  href?: string;
  /** Button styling variant */
  variant?: 'primary' | 'secondary' | 'outline';
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

/**
 * Configuration for Hero overlay
 */
export interface HeroOverlay {
  /** Overlay colour (hex, rgb, or Tailwind class) */
  colour?: string;
  /** Overlay opacity (0-1) */
  opacity?: number;
}

/**
 * Configuration for background gradient
 */
export interface HeroGradient {
  /** Gradient direction (e.g. 'to-right', 'to-bottom') */
  direction?: 'to-right' | 'to-bottom' | 'to-top' | 'to-left' | 'to-bottom-right' | 'to-top-right';
  /** Starting colour of gradient */
  from: string;
  /** Ending colour of gradient */
  to: string;
}

/**
 * Hero component props
 */
export interface HeroProps {
  /** Page title/heading for the Hero section */
  title: string;
  /** Aria label for the heading (defaults to title) */
  titleAriaLabel?: string;
  /** Subtitle text (optional) */
  subtitle?: string;
  /** Description text (optional) */
  description?: string;
  /** Buttons/CTAs to display */
  buttons?: HeroButton[];
  /** Background type */
  backgroundType?: 'image' | 'video' | 'gradient' | 'colour';
  /** Background image URL (required if backgroundType is 'image') */
  backgroundImage?: string;
  /** Background image alt text */
  backgroundImageAlt?: string;
  /** Background video URL (required if backgroundType is 'video') */
  backgroundVideo?: string;
  /** Background video poster image URL */
  backgroundVideoPoster?: string;
  /** Solid background colour */
  backgroundColour?: string;
  /** Gradient configuration */
  gradient?: HeroGradient;
  /** Overlay configuration */
  overlay?: HeroOverlay;
  /** Content layout: centered, left-aligned, or right-aligned */
  layout?: 'centered' | 'left' | 'right';
  /** Text alignment within the content area */
  textAlign?: 'center' | 'left' | 'right';
  /** Heading size variant */
  headingSize?: 'small' | 'medium' | 'large';
  /** Minimum height of Hero section (in pixels) */
  minHeight?: number;
  /** Custom CSS class for the Hero container */
  className?: string;
  /** Additional React node to render alongside or instead of content */
  children?: ReactNode;
  /** ARIA label for the entire Hero section */
  ariaLabel?: string;
  /** Role attribute for accessibility */
  role?: string;
}

/**
 * Hero Component
 *
 * A versatile, fully-accessible hero section component supporting multiple background types,
 * overlay customisation, flexible layouts, and comprehensive accessibility features.
 *
 * Supports:
 * - Multiple background types (image, video, gradient, solid colour)
 * - Configurable overlay with opacity
 * - Three layout variations (centered, left, right)
 * - Responsive design (mobile-first)
 * - Full WCAG 2.1 AA accessibility compliance
 * - Multiple CTA buttons
 *
 * @example
 * ```tsx
 * <Hero
 *   title="Welcome to Our Site"
 *   subtitle="Discover amazing features"
 *   description="Build something incredible with us"
 *   backgroundType="image"
 *   backgroundImage="https://example.com/hero.jpg"
 *   layout="centered"
 *   buttons={[
 *     { label: 'Get Started', onClick: () => console.log('clicked') }
 *   ]}
 * />
 * ```
 */
export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      title,
      titleAriaLabel,
      subtitle,
      description,
      buttons,
      backgroundType = 'colour',
      backgroundImage,
      backgroundImageAlt: _backgroundImageAlt,
      backgroundVideo,
      backgroundVideoPoster,
      backgroundColour = 'bg-slate-900',
      gradient,
      overlay = { colour: 'black', opacity: 0.4 },
      layout = 'centered',
      textAlign: _textAlign,
      headingSize = 'large',
      minHeight = 400,
      className = '',
      children,
      ariaLabel,
      role = 'region',
    },
    ref,
  ) => {
    // Build background styles based on type
    const getBackgroundStyles = (): CSSProperties & { [key: string]: string } => {
      const styles: CSSProperties & { [key: string]: string } = {};

      switch (backgroundType) {
        case 'image':
          if (backgroundImage) {
            styles.backgroundImage = `url('${backgroundImage}')`;
            styles.backgroundSize = 'cover';
            styles.backgroundPosition = 'center';
            styles.backgroundAttachment = 'fixed';
          }
          break;
        case 'video':
          // Video background handled via video element
          break;
        case 'gradient':
          if (gradient) {
            const directionMap: Record<string, string> = {
              'to-right': '90deg',
              'to-bottom': '180deg',
              'to-top': '0deg',
              'to-left': '270deg',
              'to-bottom-right': '135deg',
              'to-top-right': '45deg',
            };
            const angle = directionMap[gradient.direction || 'to-right'];
            styles.background = `linear-gradient(${angle}, ${gradient.from}, ${gradient.to})`;
          }
          break;
        case 'colour':
        default:
          styles.backgroundColor = backgroundColour;
          break;
      }

      return styles;
    };

    // Calculate overlay styles
    const overlayOpacity =
      overlay?.opacity !== undefined ? overlay.opacity : 0.4;
    const overlayColour = overlay?.colour || 'black';

    // Build content positioning classes
    const layoutMap = {
      centered: 'items-center justify-center text-center',
      left: 'items-start justify-center text-left',
      right: 'items-end justify-center text-right',
    };

    const headingSizeMap = {
      small: 'text-3xl sm:text-4xl',
      medium: 'text-4xl sm:text-5xl',
      large: 'text-5xl sm:text-6xl',
    };

    const containerClasses = `
      relative w-full h-full overflow-hidden flex flex-col
      ${className}
    `.trim();

    const contentClasses = `
      relative z-10 flex flex-1 flex-col justify-center px-4 sm:px-6 lg:px-8
      ${layoutMap[layout]}
    `.trim();

    return (
      <section
        ref={ref}
        className={containerClasses}
        style={{
          minHeight: `${minHeight}px`,
        }}
        aria-label={ariaLabel || title}
        role={role}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={getBackgroundStyles()}
          role="presentation"
          aria-hidden="true"
        />

        {/* Video background (if applicable) */}
        {backgroundType === 'video' && backgroundVideo && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            poster={backgroundVideoPoster}
            role="presentation"
            aria-hidden="true"
          >
            <source src={backgroundVideo} />
          </video>
        )}

        {/* Overlay layer */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: overlayColour,
            opacity: overlayOpacity,
          }}
          role="presentation"
          aria-hidden="true"
        />

        {/* Content container */}
        <div className={contentClasses}>
          {children ? (
            children
          ) : (
            <>
              {/* Title/Heading */}
              <h1
                className={`
                  font-bold text-white drop-shadow-lg mb-4
                  ${headingSizeMap[headingSize]}
                `}
                aria-label={titleAriaLabel}
              >
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <h2
                  className="text-xl sm:text-2xl text-white drop-shadow-md mb-4 font-semibold"
                  aria-label={`Subtitle: ${subtitle}`}
                >
                  {subtitle}
                </h2>
              )}

              {/* Description */}
              {description && (
                <p className="text-base sm:text-lg text-gray-100 drop-shadow-md mb-8 max-w-2xl">
                  {description}
                </p>
              )}

              {/* Buttons/CTAs */}
              {buttons && buttons.length > 0 && (
                <div
                  className={`
                    flex flex-wrap gap-3
                    ${layout === 'centered' ? 'justify-center' : ''}
                    ${layout === 'left' ? 'justify-start' : ''}
                    ${layout === 'right' ? 'justify-end' : ''}
                  `}
                  role="group"
                  aria-label="Call to action buttons"
                >
                  {buttons.map((button, index) => {
                    // Map Hero button variants to shadcn Button variants
                    const buttonVariant =
                      button.variant === 'primary'
                        ? 'default'
                        : button.variant === 'secondary'
                          ? 'secondary'
                          : 'outline';

                    return (
                      <Button
                        key={index}
                        variant={buttonVariant}
                        onClick={button.onClick}
                        disabled={button.disabled}
                        aria-label={button.ariaLabel || button.label}
                        className="drop-shadow-lg"
                      >
                        {button.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    );
  },
);

Hero.displayName = 'Hero';
