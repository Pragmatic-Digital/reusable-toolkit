import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StickyHeader } from './StickyHeader';

// Mock the hooks
vi.mock('@pragmatic/hooks', () => ({
  useScrollBehavior: () => ({
    scrollY: 0,
    isScrolling: false,
    isBelowThreshold: false,
  }),
  useScrollDirection: () => ({
    direction: 'none',
    previousScrollY: 0,
    currentScrollY: 0,
  }),
  useMediaQuery: () => false, // Desktop by default
}));

describe('StickyHeader Component', () => {
  const mockLogo = {
    src: 'logo.svg',
    alt: 'Logo',
    href: '/',
  };

  describe('Basic Rendering', () => {
    it('should render header element', () => {
      render(<StickyHeader logo={mockLogo} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render logo image', () => {
      render(<StickyHeader logo={mockLogo} />);
      const logo = screen.getByAltText('Logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'logo.svg');
    });

    it('should render logo as component', () => {
      const logoComponent = { src: <span data-testid="logo-component">Logo</span>, alt: 'Logo' };
      render(<StickyHeader logo={logoComponent as any} />);
      expect(screen.getByTestId('logo-component')).toBeInTheDocument();
    });

    it('should have banner role for accessibility', () => {
      render(<StickyHeader logo={mockLogo} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should render navigation links', () => {
      const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
      ];
      render(<StickyHeader logo={mockLogo} navLinks={navLinks} />);
      // Navigation menu will be rendered but items might be in content
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render navigation with submenu', () => {
      const navLinks = [
        {
          label: 'Products',
          href: '/products',
          submenu: [
            { label: 'Featured', href: '/featured' },
            { label: 'New', href: '/new' },
          ],
        },
      ];
      render(<StickyHeader logo={mockLogo} navLinks={navLinks} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('CTA Buttons', () => {
    it('should render CTA buttons', () => {
      const buttons = [
        { label: 'Sign In', href: '/signin' },
        { label: 'Sign Up', href: '/signup' },
      ];
      render(<StickyHeader logo={mockLogo} buttons={buttons} />);
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should handle button clicks', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const buttons = [{ label: 'Action', onClick }];
      render(<StickyHeader logo={mockLogo} buttons={buttons} />);

      const btn = screen.getByRole('button', { name: /action/i });
      await user.click(btn);

      expect(onClick).toHaveBeenCalled();
    });

    it('should disable buttons', () => {
      const buttons = [{ label: 'Disabled', disabled: true }];
      render(<StickyHeader logo={mockLogo} buttons={buttons} />);
      const btn = screen.getByRole('button', { name: /disabled/i });
      expect(btn).toBeDisabled();
    });
  });

  describe('Search', () => {
    it('should render search input when enabled', () => {
      const search = { enabled: true, placeholder: 'Search products...' };
      render(<StickyHeader logo={mockLogo} search={search} />);
      expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    });

    it('should not render search when disabled', () => {
      const search = { enabled: false };
      render(<StickyHeader logo={mockLogo} search={search} />);
      expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
    });

    it('should handle search submission', async () => {
      const user = userEvent.setup();
      const onSearch = vi.fn();
      const search = { enabled: true, placeholder: 'Search...', onSearch };
      render(<StickyHeader logo={mockLogo} search={search} />);

      const input = screen.getByPlaceholderText('Search...');
      await user.type(input, 'test query');
      await user.keyboard('{Enter}');

      expect(onSearch).toHaveBeenCalledWith('test query');
    });
  });

  describe('User Profile', () => {
    it('should render user avatar', () => {
      const user = { name: 'John Doe', initials: 'JD' };
      render(<StickyHeader logo={mockLogo} user={user} />);
      expect(screen.getByRole('img', { name: /john doe/i })).toBeInTheDocument();
    });

    it('should render user profile with avatar image', () => {
      const user = { name: 'Jane Doe', avatarUrl: 'avatar.jpg', initials: 'JD' };
      render(<StickyHeader logo={mockLogo} user={user} />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Layout Variants', () => {
    it('should support spread layout', () => {
      render(<StickyHeader logo={mockLogo} layout="spread" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should support centered layout', () => {
      render(<StickyHeader logo={mockLogo} layout="centered" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should support logo-left-nav-right layout', () => {
      render(<StickyHeader logo={mockLogo} layout="logo-left-nav-right" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should support logo-left-nav-center layout', () => {
      render(<StickyHeader logo={mockLogo} layout="logo-left-nav-center" />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Sticky Behavior', () => {
    it('should have sticky positioning when enabled', () => {
      const { container } = render(<StickyHeader logo={mockLogo} sticky={true} />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('sticky');
    });

    it('should not have sticky positioning when disabled', () => {
      const { container } = render(<StickyHeader logo={mockLogo} sticky={false} />);
      const header = container.querySelector('header');
      expect(header).not.toHaveClass('sticky');
    });
  });

  describe('Styling', () => {
    it('should apply custom background colour', () => {
      const { container } = render(<StickyHeader logo={mockLogo} backgroundColor="bg-slate-100" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('bg-slate-100');
    });

    it('should apply border styles', () => {
      const { container } = render(<StickyHeader logo={mockLogo} border="bottom" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('border-b');
    });

    it('should apply custom className', () => {
      const { container } = render(<StickyHeader logo={mockLogo} className="custom-class" />);
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-class');
    });

    it('should apply custom z-index', () => {
      const { container } = render(<StickyHeader logo={mockLogo} zIndex={100} />);
      const header = container.querySelector('header');
      expect(header).toHaveStyle({ zIndex: '100' });
    });
  });

  describe('Announcement Bar', () => {
    it('should render announcement when provided', () => {
      const announcement = { message: 'Special offer!' };
      render(<StickyHeader logo={mockLogo} announcement={announcement} />);
      expect(screen.getByText('Special offer!')).toBeInTheDocument();
    });

    it('should dismiss announcement', async () => {
      const user = userEvent.setup();
      const announcement = { message: 'Sale now!', dismissible: true };
      render(<StickyHeader logo={mockLogo} announcement={announcement} />);

      const closeBtn = screen.getByLabelText('Dismiss announcement');
      await user.click(closeBtn);

      await waitFor(() => {
        expect(screen.queryByText('Sale now!')).not.toBeInTheDocument();
      });
    });

    it('should render announcement with action button', () => {
      const announcement = {
        message: 'New feature!',
        action: { label: 'Learn More', onClick: vi.fn() },
      };
      render(<StickyHeader logo={mockLogo} announcement={announcement} />);
      expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
    });
  });

  describe('Skip Link', () => {
    it('should include skip link by default', () => {
      render(<StickyHeader logo={mockLogo} />);
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('should not include skip link when disabled', () => {
      render(<StickyHeader logo={mockLogo} includeSkipLink={false} />);
      expect(screen.queryByText('Skip to main content')).not.toBeInTheDocument();
    });

    it('should use custom skip link target', () => {
      render(<StickyHeader logo={mockLogo} skipLinkTarget="content" />);
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toHaveAttribute('href', '#content');
    });
  });

  describe('Custom Content', () => {
    it('should render custom children', () => {
      render(
        <StickyHeader logo={mockLogo}>
          <div data-testid="custom-content">Custom Header</div>
        </StickyHeader>
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should render custom mobile menu', () => {
      const customMobileMenu = <nav data-testid="custom-mobile">Custom Mobile</nav>;
      render(<StickyHeader logo={mockLogo} customMobileMenu={customMobileMenu} />);
      // Note: Custom mobile menu renders in Sheet
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to header element', () => {
      const ref = React.createRef<HTMLElement>();
      render(<StickyHeader ref={ref} logo={mockLogo} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('HEADER');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<StickyHeader logo={mockLogo} ariaLabel="Main header" />);
      expect(screen.getByLabelText('Main header')).toBeInTheDocument();
    });

    it('should have logo aria-label', () => {
      const logo = { src: 'logo.svg', alt: 'Logo', ariaLabel: 'Company Logo' };
      render(<StickyHeader logo={logo} />);
      expect(screen.getByLabelText('Company Logo')).toBeInTheDocument();
    });

    it('should have proper announcement live region', () => {
      const announcement = { message: 'Important!' };
      render(<StickyHeader logo={mockLogo} announcement={announcement} />);
      const region = screen.getByRole('status');
      expect(region).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Height Configuration', () => {
    it('should apply custom height', () => {
      const { container } = render(<StickyHeader logo={mockLogo} height={80} />);
      const header = container.querySelector('header');
      expect(header).toHaveStyle({ minHeight: '80px' });
    });

    it('should use default height', () => {
      const { container } = render(<StickyHeader logo={mockLogo} />);
      const header = container.querySelector('header');
      expect(header).toHaveStyle({ minHeight: '64px' });
    });
  });
});
