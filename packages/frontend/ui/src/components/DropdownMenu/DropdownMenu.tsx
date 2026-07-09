import React, { ReactNode } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

export interface DropdownMenuItemProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
}

export interface DropdownMenuProps {
  /** Trigger element */
  children: ReactNode;
  /** Menu items */
  items: DropdownMenuItemProps[];
  /** Optional menu title */
  title?: string;
  /** Custom trigger className */
  triggerClassName?: string;
  /** Custom content className */
  contentClassName?: string;
}

/**
 * DropdownMenu Component
 *
 * A flexible dropdown menu using Radix UI primitives.
 * Perfect for user profiles, actions, and settings menus.
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   items={[
 *     { label: 'Profile', onClick: () => nav('/profile') },
 *     { label: 'Logout', onClick: logout, variant: 'destructive' }
 *   ]}
 * >
 *   <button>User Menu</button>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  (
    {
      children,
      items,
      title,
      triggerClassName,
      contentClassName,
    },
    ref
  ) => {
    return (
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger
          className={clsx(
            'outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 rounded',
            triggerClassName
          )}
          asChild
        >
          {children}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            ref={ref}
            className={clsx(
              'min-w-[200px] bg-white rounded-md border border-slate-200 shadow-lg p-1 z-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              contentClassName
            )}
            sideOffset={8}
          >
            {/* Title */}
            {title && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold text-slate-950">
                  {title}
                </div>
                <DropdownMenuPrimitive.Separator className="my-1 h-px bg-slate-200" />
              </>
            )}

            {/* Items */}
            {items.map((item, index) => (
              <DropdownMenuPrimitive.Item
                key={index}
                disabled={item.disabled}
                className={clsx(
                  'relative flex items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none cursor-pointer transition-colors',
                  item.disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : item.variant === 'destructive'
                      ? 'text-red-600 hover:bg-red-50 focus-visible:bg-red-50'
                      : 'text-slate-700 hover:bg-slate-100 focus-visible:bg-slate-100'
                )}
                onSelect={item.onClick}
              >
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </DropdownMenuPrimitive.Item>
            ))}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    );
  }
);

DropdownMenu.displayName = 'DropdownMenu';
