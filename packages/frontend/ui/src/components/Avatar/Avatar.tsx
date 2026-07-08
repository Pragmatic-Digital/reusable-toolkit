import React, { ImgHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-700 font-semibold shrink-0',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        default: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-2xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'>, VariantProps<typeof avatarVariants> {
  /** Fallback initials when image fails to load */
  initials?: string;
  /** Alternative text for the image */
  alt: string;
  /** Custom wrapper className */
  wrapperClassName?: string;
  /** Background colour for fallback */
  bgColour?: string;
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  (
    {
      className,
      wrapperClassName,
      size = 'default',
      src,
      initials,
      alt,
      bgColour = 'bg-slate-100',
      onError,
      onLoad,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageError(true);
      onError?.(e as any);
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setImageLoaded(true);
      onLoad?.(e as any);
    };

    // Show fallback if image hasn't loaded or failed
    if (!src || !imageLoaded || imageError) {
      return (
        <div
          className={clsx(
            avatarVariants({ size }),
            bgColour,
            wrapperClassName
          )}
          role="img"
          aria-label={initials || alt}
        >
          {initials}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={clsx(
          avatarVariants({ size }),
          'object-cover',
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = 'Avatar';
