import React, { ReactNode } from 'react';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { clsx } from 'clsx';

export interface NavigationMenuTrigger {
  label: string;
  icon?: ReactNode;
}

export interface NavigationMenuLink {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

export interface NavigationMenuItem {
  trigger: NavigationMenuTrigger;
  content: NavigationMenuLink[] | ReactNode;
  description?: string;
}

export interface NavigationMenuProps {
  /** Menu items with triggers and content */
  items: NavigationMenuItem[];
  /** Optional menu orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Custom trigger className */
  triggerClassName?: string;
  /** Custom content className */
  contentClassName?: string;
  /** Custom className for the container */
  containerClassName?: string;
}

/**
 * NavigationMenu Component
 *
 * A flexible navigation menu using Radix UI NavigationMenu primitives.
 * Perfect for main site navigation, mega menus, and hierarchical navigation.
 *
 * Features:
 * - Multiple menu items with hover/click activation
 * - Content slots for dropdown items or custom content
 * - Full keyboard navigation (arrow keys, Tab, Enter)
 * - Accessible with proper ARIA labels
 * - Smooth animations and transitions
 *
 * @example
 * ```tsx
 * <NavigationMenu
 *   items={[
 *     {
 *       trigger: { label: 'Products' },
 *       content: [
 *         { label: 'Featured', href: '/products/featured' },
 *         { label: 'New', href: '/products/new' }
 *       ]
 *     }
 *   ]}
 * />
 * ```
 */
export const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  (
    {
      items,
      orientation = 'horizontal',
      triggerClassName,
      contentClassName,
      containerClassName,
    },
    ref
  ) => {
    return (
      <NavigationMenuPrimitive.Root
        ref={ref}
        orientation={orientation}
        className={clsx(
          'flex gap-1',
          containerClassName
        )}
      >
        <NavigationMenuPrimitive.List className="flex gap-1">
          {items.map((item, index) => (
            <NavigationMenuPrimitive.Item key={index}>
              {/* Trigger */}
              <NavigationMenuPrimitive.Trigger
                className={clsx(
                  'group inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 data-[state=open]:bg-slate-100',
                  triggerClassName
                )}
              >
                <span className="flex items-center gap-2">
                  {item.trigger.icon && <span>{item.trigger.icon}</span>}
                  {item.trigger.label}
                </span>
                <span
                  className="relative ml-1 h-1.5 w-1.5 rounded-full group-data-[state=open]:rotate-180 transition-transform"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </NavigationMenuPrimitive.Trigger>

              {/* Content */}
              <NavigationMenuPrimitive.Content
                className={clsx(
                  'absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
                  contentClassName
                )}
              >
                {/* Check if content is array of links */}
                {Array.isArray(item.content) ? (
                  <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] bg-white rounded-lg border border-slate-200 shadow-lg">
                    {item.description && (
                      <p className="text-sm text-slate-600 font-medium">
                        {item.description}
                      </p>
                    )}
                    <ul className="grid gap-2">
                      {item.content.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.href ? (
                            <a
                              href={link.href}
                              className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-50 focus-visible:bg-slate-50"
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none text-slate-900">
                                {link.icon && <span>{link.icon}</span>}
                                {link.label}
                              </div>
                            </a>
                          ) : (
                            <button
                              onClick={link.onClick}
                              className="w-full group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 text-left"
                            >
                              <div className="flex items-center gap-2 text-sm font-medium leading-none text-slate-900">
                                {link.icon && <span>{link.icon}</span>}
                                {link.label}
                              </div>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Custom content
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-lg">
                    {item.content}
                  </div>
                )}
              </NavigationMenuPrimitive.Content>
            </NavigationMenuPrimitive.Item>
          ))}
        </NavigationMenuPrimitive.List>

        {/* Indicator */}
        <NavigationMenuPrimitive.Indicator
          className="data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[10] flex h-1.5 items-end justify-center overflow-hidden transition-all"
        >
          <div className="relative top-1 h-2 w-2 rounded-tl-sm bg-slate-200 rotate-45" />
        </NavigationMenuPrimitive.Indicator>

        {/* Viewport */}
        <div className="absolute left-0 top-full flex w-full justify-center">
          <NavigationMenuPrimitive.Viewport
            className="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]"
          />
        </div>
      </NavigationMenuPrimitive.Root>
    );
  }
);

NavigationMenu.displayName = 'NavigationMenu';
