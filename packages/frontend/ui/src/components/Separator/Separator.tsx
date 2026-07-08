import React, { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const separatorVariants = cva('shrink-0 bg-slate-200', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof separatorVariants> {
  /** Decorative text to display in the centre of the separator */
  decorative?: string;
  /** Whether this separator is purely decorative (aria-hidden) */
  isDecorative?: boolean;
}

/**
 * Separator Component
 *
 * A flexible visual divider that can be horizontal or vertical.
 * Useful for separating sections of content or creating visual hierarchy.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" />
 * <Separator decorative="OR" />
 * ```
 */
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative,
      isDecorative = true,
      ...props
    },
    ref
  ) => {
    if (decorative) {
      return (
        <div
          ref={ref}
          className={clsx(
            'flex items-center gap-4',
            className,
          )}
          {...props}
        >
          <div className={clsx(separatorVariants({ orientation }))} />
          <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
            {decorative}
          </span>
          <div className={clsx(separatorVariants({ orientation }))} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={clsx(
          separatorVariants({ orientation }),
          className,
        )}
        role={isDecorative ? 'presentation' : 'separator'}
        aria-hidden={isDecorative}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';
