import React, { CSSProperties, ReactNode, useState } from 'react';
import { clsx } from 'clsx';
import { useScrollBehavior, useScrollDirection, useMediaQuery } from '@pragmatic/hooks';
import { Button } from '../ui/button';
import { Input } from '../Input';
import { Avatar } from '../Avatar';
import { Separator } from '../Separator';
import { Sheet } from '../Sheet';
import { DropdownMenu } from '../DropdownMenu';
import { NavigationMenu } from '../NavigationMenu';

/**
 * Navigation link configuration
 */
export interface StickyHeaderNavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  submenu?: StickyHeaderNavLink[];
  ariaLabel?: string;
  target?: '_blank' | '_self';
}

/**
 * Logo configuration
 */
export interface StickyHeaderLogo {
  src: string | ReactNode;
  alt: string;
  href?: string;
  width?: number;
  height?: number;
  ariaLabel?: string;
}

/**
 * CTA button configuration
 */
export interface StickyHeaderButton {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
  icon?: ReactNode;
}

/**
 * Search configuration
 */
export interface StickyHeaderSearch {
  enabled: boolean;
  placeholder?: string;
  onSearch?: (query: string) => void;
  ariaLabel?: string;
  expandable?: boolean;
}

/**
 * User profile configuration
 */
export interface StickyHeaderUser {
  name: string;
  avatarUrl?: string;
  initials?: string;
  menuItems?: StickyHeaderNavLink[];
  ariaLabel?: string;
}

/**
 * Scroll behavior configuration
 */
export interface StickyHeaderScrollBehavior {
  type: 'none' | 'fade' | 'shrink' | 'hide' | 'blur';
  offset?: number;
  hideOnScrollDown?: boolean;
  showShadow?: boolean;
  changeBackground?: boolean;
  scrolledBackground?: string;
  scrolledOpacity?: number;
}

/**
 * Announcement bar configuration
 */
export interface StickyHeaderAnnouncement {
  message: string | ReactNode;
  dismissible?: boolean;
  backgroundColor?: string;
  textColor?: string;
  action?: StickyHeaderButton;
}

/**
 * Main StickyHeader component props
 */
export interface StickyHeaderProps {
  /** Logo configuration (required) */
  logo: StickyHeaderLogo;

  /** Navigation links */
  navLinks?: StickyHeaderNavLink[];

  /** CTA buttons */
  buttons?: StickyHeaderButton[];

  /** Search configuration */
  search?: StickyHeaderSearch;

  /** User profile configuration */
  user?: StickyHeaderUser;

  /** Layout variant */
  layout?: 'spread' | 'centered' | 'logo-left-nav-right' | 'logo-left-nav-center';

  /** Whether header is sticky */
  sticky?: boolean;

  /** Scroll behavior configuration */
  scrollBehavior?: StickyHeaderScrollBehavior;

  /** Optional announcement bar */
  announcement?: StickyHeaderAnnouncement;

  /** Background colour */
  backgroundColor?: string;

  /** Border configuration */
  border?: 'none' | 'bottom' | 'top' | 'both';

  /** Border colour */
  borderColor?: string;

  /** Height of header in pixels */
  height?: number;

  /** Breakpoint for mobile menu in pixels */
  mobileBreakpoint?: number;

  /** Custom CSS class */
  className?: string;

  /** Custom mobile menu component */
  customMobileMenu?: ReactNode;

  /** Custom desktop nav component */
  customDesktopNav?: ReactNode;

  /** Children for complete customisation */
  children?: ReactNode;

  /** ARIA label for header */
  ariaLabel?: string;

  /** Z-index for header */
  zIndex?: number;

  /** Whether to show blur effect */
  blur?: boolean;

  /** Whether header is transparent initially */
  transparent?: boolean;

  /** Mobile menu side */
  mobileMenuSide?: 'left' | 'right';

  /** Whether to include skip link */
  includeSkipLink?: boolean;

  /** Skip link target ID */
  skipLinkTarget?: string;
}

/**
 * StickyHeader Component
 *
 * A comprehensive, production-ready sticky header component that orchestrates
 * all UI components to create a flexible, accessible, responsive header.
 *
 * Features:
 * - Multiple layout variants
 * - Scroll behaviors (fade, shrink, hide, blur)
 * - Responsive mobile menu with Sheet
 * - Desktop navigation with NavigationMenu
 * - User profile dropdown
 * - Search functionality
 * - Announcement bar
 * - Full accessibility (WCAG 2.1 AA)
 * - Keyboard navigation
 * - Scroll direction detection
 *
 * @example
 * ```tsx
 * <StickyHeader
 *   logo={{ src: 'logo.svg', alt: 'Logo', href: '/' }}
 *   navLinks={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' }
 *   ]}
 *   buttons={[{ label: 'Sign In', href: '/signin' }]}
 *   layout="spread"
 *   sticky
 * />
 * ```
 */
export const StickyHeader = React.forwardRef<HTMLElement, StickyHeaderProps>(
  (
    {
      logo,
      navLinks = [],
      buttons = [],
      search,
      user,
      layout = 'spread',
      sticky = true,
      scrollBehavior,
      announcement,
      backgroundColor = 'bg-white',
      border = 'bottom',
      borderColor = 'border-slate-200',
      height = 64,
      mobileBreakpoint = 768,
      className,
      customMobileMenu,
      customDesktopNav,
      children,
      ariaLabel,
      zIndex = 50,
      blur = false,
      transparent = false,
      mobileMenuSide = 'left',
      includeSkipLink = true,
      skipLinkTarget = 'main-content',
    },
    ref
  ) => {
    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);

    // Hooks for responsive and scroll detection
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);
    const scrollState = useScrollBehavior({ offset: scrollBehavior?.offset || 50 });
    const scrollDirection = useScrollDirection();

    // Determine if header should be hidden (hide on scroll down)
    const shouldHideHeader = scrollBehavior?.hideOnScrollDown && scrollDirection.direction === 'down';

    // Determine scroll-based styles
    const getScrollStyles = (): CSSProperties => {
      const styles: CSSProperties = {};

      if (!scrollBehavior || scrollBehavior.type === 'none') {
        return styles;
      }

      switch (scrollBehavior.type) {
        case 'fade':
          styles.opacity = scrollState.isBelowThreshold
            ? scrollBehavior.scrolledOpacity || 0.95
            : 1;
          break;

        case 'shrink':
          const heightMultiplier = scrollState.isBelowThreshold ? 0.8 : 1;
          styles.transform = `scaleY(${heightMultiplier})`;
          break;

        case 'blur':
          styles.backdropFilter = scrollState.isBelowThreshold ? 'blur(10px)' : 'blur(0px)';
          break;
      }

      return styles;
    };

    // Get background style based on scroll
    const getBackgroundStyle = (): string => {
      if (!scrollBehavior?.changeBackground || !scrollState.isBelowThreshold) {
        return backgroundColor;
      }
      return scrollBehavior.scrolledBackground || backgroundColor;
    };

    // Get border style
    const getBorderClass = (): string => {
      if (border === 'none') return '';
      if (border === 'bottom') return 'border-b';
      if (border === 'top') return 'border-t';
      if (border === 'both') return 'border-t border-b';
      return 'border-b';
    };

    // Layout position classes
    const getLayoutClasses = (): string => {
      switch (layout) {
        case 'centered':
          return 'justify-center';
        case 'logo-left-nav-right':
          return 'justify-between';
        case 'logo-left-nav-center':
          return '';
        case 'spread':
        default:
          return 'justify-between';
      }
    };

    // Navigation items for mobile and desktop
    const navMenuItems = navLinks.map((link) => ({
      trigger: { label: link.label, icon: link.icon },
      content: link.submenu
        ? link.submenu.map((sub) => ({
            label: sub.label,
            href: sub.href,
            onClick: sub.onClick,
          }))
        : [],
    }));

    // Custom children support
    if (children) {
      return (
        <header
          ref={ref}
          className={clsx(
            'w-full transition-all duration-300',
            sticky && 'sticky top-0',
            className
          )}
          style={{ zIndex: zIndex.toString(), minHeight: `${height}px`, ...getScrollStyles() }}
          aria-label={ariaLabel}
          role="banner"
        >
          {children}
        </header>
      );
    }

    return (
      <>
        {/* Skip Link */}
        {includeSkipLink && (
          <a
            href={`#${skipLinkTarget}`}
            className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white"
          >
            Skip to main content
          </a>
        )}

        {/* Announcement Bar */}
        {announcement && isAnnouncementVisible && (
          <div
            className={clsx(
              'w-full px-4 py-2 text-sm text-center',
              announcement.backgroundColor || 'bg-blue-50',
              announcement.textColor || 'text-blue-900'
            )}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-center gap-2">
              <span>{announcement.message}</span>
              {announcement.dismissible && (
                <button
                  onClick={() => setIsAnnouncementVisible(false)}
                  className="ml-2 text-xs font-medium hover:opacity-75"
                  aria-label="Dismiss announcement"
                >
                  ✕
                </button>
              )}
              {announcement.action && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={announcement.action.onClick}
                  className="ml-2"
                >
                  {announcement.action.label}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Header */}
        <header
          ref={ref}
          className={clsx(
            'w-full transition-all duration-300',
            sticky && 'sticky top-0',
            shouldHideHeader && '-translate-y-full',
            getBorderClass(),
            borderColor,
            getBackgroundStyle(),
            blur && 'backdrop-blur-md',
            className
          )}
          style={{
            zIndex: zIndex.toString(),
            minHeight: `${height}px`,
            ...getScrollStyles(),
          }}
          aria-label={ariaLabel}
          role="banner"
        >
          {/* Desktop Navigation */}
          {!isMobile ? (
            <nav className={clsx('flex items-center justify-between h-full px-4 sm:px-6 lg:px-8', getLayoutClasses())}>
              {/* Logo */}
              <div className="flex-shrink-0">
                {typeof logo.src === 'string' ? (
                  <a
                    href={logo.href || '#'}
                    className="inline-flex items-center"
                    aria-label={logo.ariaLabel || logo.alt}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width || 40}
                      height={logo.height || 40}
                      className="h-auto"
                    />
                  </a>
                ) : (
                  <a
                    href={logo.href || '#'}
                    className="inline-flex items-center"
                    aria-label={logo.ariaLabel || logo.alt}
                  >
                    {logo.src}
                  </a>
                )}
              </div>

              {/* Desktop Navigation Menu */}
              {!customDesktopNav && navLinks.length > 0 && (
                <div className="hidden md:flex">
                  <NavigationMenu items={navMenuItems} />
                </div>
              )}
              {customDesktopNav && <div className="hidden md:flex">{customDesktopNav}</div>}

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Search */}
                {search?.enabled && (
                  <Input
                    type="search"
                    placeholder={search.placeholder || 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && search.onSearch) {
                        search.onSearch(searchQuery);
                      }
                    }}
                    size="sm"
                    className="max-w-xs"
                    aria-label={search.ariaLabel}
                  />
                )}

                {/* CTA Buttons */}
                {buttons.map((btn, idx) => (
                  <Button
                    key={idx}
                    variant={btn.variant}
                    size={btn.size}
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                    aria-label={btn.ariaLabel}
                  >
                    {btn.icon && <span className="mr-2">{btn.icon}</span>}
                    {btn.label}
                  </Button>
                ))}

                {/* User Profile Dropdown */}
                {user && (
                  <DropdownMenu
                    items={
                      user.menuItems?.map((item) => ({
                        label: item.label,
                        onClick: item.onClick,
                      })) || []
                    }
                    title={user.name}
                  >
                    <button className="rounded-full overflow-hidden hover:opacity-80 transition-opacity">
                      <Avatar
                        alt={user.name}
                        src={user.avatarUrl}
                        initials={user.initials}
                        size="sm"
                      />
                    </button>
                  </DropdownMenu>
                )}
              </div>
            </nav>
          ) : (
            /* Mobile Navigation */
            <div className="flex items-center justify-between h-full px-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                {typeof logo.src === 'string' ? (
                  <a href={logo.href || '#'} aria-label={logo.ariaLabel || logo.alt}>
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width || 32}
                      height={logo.height || 32}
                      className="h-auto"
                    />
                  </a>
                ) : (
                  <a href={logo.href || '#'} aria-label={logo.ariaLabel || logo.alt}>
                    {logo.src}
                  </a>
                )}
              </div>

              {/* Mobile Menu Trigger */}
              <Sheet
                side={mobileMenuSide}
                title="Menu"
                content={
                  customMobileMenu || (
                    <nav className="space-y-2">
                      {navLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.href || '#'}
                          className="block px-3 py-2 rounded hover:bg-slate-100"
                          onClick={link.onClick}
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  )
                }
              >
                <button
                  className="p-2 hover:bg-slate-100 rounded"
                  aria-label="Open menu"
                  aria-expanded="false"
                >
                  ☰
                </button>
              </Sheet>
            </div>
          )}
        </header>
      </>
    );
  }
);

StickyHeader.displayName = 'StickyHeader';
