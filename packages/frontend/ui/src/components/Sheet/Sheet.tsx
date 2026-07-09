import React, { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { clsx } from 'clsx';

export interface SheetProps {
  /** Whether the sheet is open */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Side the sheet slides in from */
  side?: 'left' | 'right' | 'top' | 'bottom';
  /** Sheet trigger element */
  children: ReactNode;
  /** Sheet content */
  content: ReactNode;
  /** Optional sheet title for accessibility */
  title?: string;
  /** Optional sheet description for accessibility */
  description?: string;
  /** Custom className for the overlay */
  overlayClassName?: string;
  /** Custom className for the sheet content container */
  contentClassName?: string;
  /** Whether to close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Custom close button content (if falsy, no close button shown) */
  closeButtonContent?: ReactNode | false;
}

/**
 * Sheet Component
 *
 * A flexible, accessible slide-out panel using Radix UI Dialog.
 * Perfect for mobile menus, sidebars, and off-canvas content.
 *
 * Features:
 * - Slides in from any side (left, right, top, bottom)
 * - Full focus management and keyboard support
 * - Overlay with customisable click-to-close
 * - Accessible with proper ARIA labels
 *
 * @example
 * ```tsx
 * <Sheet
 *   side="left"
 *   title="Navigation"
 *   content={<nav><a href="/">Home</a></nav>}
 * >
 *   <button>Menu</button>
 * </Sheet>
 * ```
 */
export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      open,
      onOpenChange,
      side = 'left',
      children,
      content,
      title,
      description,
      overlayClassName,
      contentClassName,
      closeOnOverlayClick = true,
      closeButtonContent = '✕',
    },
    ref
  ) => {
    // Side-based styling
    const getSideClasses = (side: string) => {
      switch (side) {
        case 'right':
          return 'right-0 top-0 h-full w-3/4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right';
        case 'top':
          return 'top-0 left-0 w-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top';
        case 'bottom':
          return 'bottom-0 left-0 w-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom';
        case 'left':
        default:
          return 'left-0 top-0 h-full w-3/4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left';
      }
    };

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        {/* Trigger */}
        <Dialog.Trigger asChild>
          {children}
        </Dialog.Trigger>

        {/* Portal */}
        <Dialog.Portal>
          {/* Overlay */}
          <Dialog.Overlay
            className={clsx(
              'fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm',
              !closeOnOverlayClick && 'pointer-events-none',
              overlayClassName
            )}
          />

          {/* Content */}
          <Dialog.Content
            ref={ref}
            className={clsx(
              'fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out duration-200 max-sm:w-full max-sm:sm:max-w-sm',
              getSideClasses(side),
              contentClassName
            )}
          >
            {/* Header with optional title */}
            {title && (
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-slate-950">
                  {title}
                </Dialog.Title>
                {closeButtonContent !== false && (
                  <Dialog.Close className="rounded-md p-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                    <span className="text-lg text-slate-600 hover:text-slate-900">
                      {closeButtonContent}
                    </span>
                  </Dialog.Close>
                )}
              </div>
            )}

            {/* Description (hidden but for accessibility) */}
            {description && (
              <Dialog.Description className="sr-only">
                {description}
              </Dialog.Description>
            )}

            {/* Sheet content */}
            <div className={clsx(title && 'mt-4')}>
              {content}
            </div>

            {/* Close button (if no title) */}
            {!title && closeButtonContent !== false && (
              <Dialog.Close className="absolute right-4 top-4 rounded-md p-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                <span className="text-lg text-slate-600 hover:text-slate-900">
                  {closeButtonContent}
                </span>
              </Dialog.Close>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

Sheet.displayName = 'Sheet';
