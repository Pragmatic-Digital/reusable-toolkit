import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StickyHeader } from './StickyHeader';

const meta: Meta<typeof StickyHeader> = {
  title: 'Components/StickyHeader',
  component: StickyHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive, production-ready sticky header component with responsive mobile menu, navigation, search, and user profile features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['spread', 'centered', 'logo-left-nav-right', 'logo-left-nav-center'],
      description: 'Header layout variant',
    },
    sticky: {
      control: 'boolean',
      description: 'Whether header sticks to top on scroll',
    },
    transparent: {
      control: 'boolean',
      description: 'Whether header starts transparent',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    logo: { src: '🏢', alt: 'Company Logo', href: '/' },
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' },
    ],
    buttons: [
      { label: 'Sign In', variant: 'outline' },
      { label: 'Sign Up', variant: 'default' },
    ],
    sticky: true,
    layout: 'spread',
  },
};

export const WithSearch: Story = {
  args: {
    logo: { src: '🔍', alt: 'Search Logo' },
    navLinks: [
      { label: 'Explore', href: '/' },
      { label: 'Categories', href: '/categories' },
    ],
    search: {
      enabled: true,
      placeholder: 'Search products...',
      onSearch: (query) => console.log('Search:', query),
    },
    buttons: [{ label: 'Cart (0)', variant: 'ghost' }],
    sticky: true,
  },
};

export const WithUserProfile: Story = {
  args: {
    logo: { src: '👤', alt: 'App Logo' },
    navLinks: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' },
      { label: 'Team', href: '/team' },
    ],
    user: {
      name: 'John Doe',
      initials: 'JD',
      menuItems: [
        { label: 'Profile', href: '/profile' },
        { label: 'Settings', href: '/settings' },
        { label: 'Sign Out', href: '/logout' },
      ],
    },
    sticky: true,
  },
};

export const WithAnnouncement: Story = {
  args: {
    logo: { src: '📢', alt: 'Logo' },
    announcement: {
      message: 'Limited time offer: Get 50% off all products!',
      dismissible: true,
      backgroundColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      action: { label: 'Shop Now', variant: 'default' },
    },
    navLinks: [
      { label: 'Products', href: '/products' },
      { label: 'Sale', href: '/sale' },
    ],
    buttons: [{ label: 'Checkout' }],
    sticky: true,
  },
};

export const Centered: Story = {
  args: {
    logo: { src: '⭐', alt: 'Premium Logo' },
    navLinks: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Blog', href: '/blog' },
    ],
    buttons: [{ label: 'Get Started' }],
    layout: 'centered',
    sticky: true,
  },
};

export const WithMegaMenu: Story = {
  args: {
    logo: { src: '🛍️', alt: 'Store Logo' },
    navLinks: [
      {
        label: 'Categories',
        submenu: [
          { label: 'Electronics', href: '/electronics' },
          { label: 'Clothing', href: '/clothing' },
          { label: 'Home & Garden', href: '/home' },
          { label: 'Sports', href: '/sports' },
        ],
      },
      {
        label: 'Deals',
        submenu: [
          { label: 'Today\'s Deals', href: '/deals/today' },
          { label: 'Lightning Sales', href: '/deals/lightning' },
          { label: 'Clearance', href: '/deals/clearance' },
        ],
      },
      {
        label: 'Account',
        submenu: [
          { label: 'My Profile', href: '/profile' },
          { label: 'Orders', href: '/orders' },
          { label: 'Wishlist', href: '/wishlist' },
        ],
      },
    ],
    search: {
      enabled: true,
      placeholder: 'Search products...',
    },
    buttons: [{ label: '🛒 Cart' }],
    sticky: true,
  },
};

export const MinimalHeader: Story = {
  args: {
    logo: { src: '◆', alt: 'Minimal Logo' },
    layout: 'spread',
    sticky: true,
  },
};

export const FullFeatured: Story = {
  args: {
    logo: { src: '🎯', alt: 'Company Logo', href: '/' },
    navLinks: [
      {
        label: 'Solutions',
        submenu: [
          { label: 'Enterprise', href: '/enterprise' },
          { label: 'Startup', href: '/startup' },
          { label: 'Personal', href: '/personal' },
        ],
      },
      {
        label: 'Resources',
        submenu: [
          { label: 'Documentation', href: '/docs' },
          { label: 'Tutorials', href: '/tutorials' },
          { label: 'Blog', href: '/blog' },
        ],
      },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Contact', href: '/contact' },
    ],
    buttons: [
      { label: 'Sign In', variant: 'ghost' },
      { label: 'Get Started', variant: 'default' },
    ],
    search: {
      enabled: true,
      placeholder: 'Search docs...',
    },
    user: {
      name: 'Sarah Anderson',
      initials: 'SA',
      menuItems: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Account', href: '/account' },
        { label: 'Preferences', href: '/preferences' },
        { label: 'Sign Out', href: '/logout' },
      ],
    },
    announcement: {
      message: '🎉 New feature released: Advanced analytics dashboard',
      dismissible: true,
      action: { label: 'View', variant: 'ghost' },
    },
    layout: 'spread',
    sticky: true,
    border: 'bottom',
  },
};

export const DarkTheme: Story = {
  args: {
    logo: { src: '✨', alt: 'Logo' },
    navLinks: [
      { label: 'Features', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Community', href: '#' },
    ],
    buttons: [{ label: 'Get Started' }],
    backgroundColor: 'bg-slate-900',
    sticky: true,
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-900 text-white" style={{ minHeight: '200px' }}>
        <Story />
        <div className="p-8 text-slate-400">
          <p>Scroll down to see sticky behaviour</p>
        </div>
      </div>
    ),
  ],
};

export const NoSticky: Story = {
  args: {
    logo: { src: '📌', alt: 'Logo' },
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
    ],
    buttons: [{ label: 'Contact' }],
    sticky: false,
  },
};

export const WithBorder: Story = {
  args: {
    logo: { src: '━', alt: 'Logo' },
    navLinks: [
      { label: 'Products', href: '/' },
      { label: 'Services', href: '/' },
    ],
    border: 'bottom',
    borderColor: 'border-slate-300',
    buttons: [{ label: 'Demo' }],
    sticky: true,
  },
};

export const LayoutVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-2 text-sm font-bold">Spread Layout</h3>
        <StickyHeader
          logo={{ src: '📍', alt: 'Logo' }}
          navLinks={[{ label: 'Menu', href: '#' }]}
          buttons={[{ label: 'Action' }]}
          layout="spread"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold">Centered Layout</h3>
        <StickyHeader
          logo={{ src: '📍', alt: 'Logo' }}
          navLinks={[{ label: 'Menu', href: '#' }]}
          buttons={[{ label: 'Action' }]}
          layout="centered"
        />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-bold">Logo Left, Nav Right</h3>
        <StickyHeader
          logo={{ src: '📍', alt: 'Logo' }}
          navLinks={[{ label: 'Menu', href: '#' }]}
          buttons={[{ label: 'Action' }]}
          layout="logo-left-nav-right"
        />
      </div>
    </div>
  ),
};

export const InteractiveDemo: Story = {
  render: () => (
    <div>
      <StickyHeader
        logo={{ src: '🚀', alt: 'Startup Logo', href: '/' }}
        navLinks={[
          {
            label: 'Product',
            submenu: [
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Security', href: '/security' },
            ],
          },
          {
            label: 'Company',
            submenu: [
              { label: 'About', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Careers', href: '/careers' },
            ],
          },
          { label: 'Docs', href: '/docs' },
        ]}
        buttons={[
          { label: 'Sign In', variant: 'ghost' },
          { label: 'Start Free Trial', variant: 'default' },
        ]}
        search={{
          enabled: true,
          placeholder: 'Search documentation...',
        }}
        user={{
          name: 'Alex Johnson',
          initials: 'AJ',
          menuItems: [
            { label: 'Profile', href: '/profile' },
            { label: 'Settings', href: '/settings' },
            { label: 'Sign Out', href: '/logout' },
          ],
        }}
        layout="spread"
        sticky={true}
        border="bottom"
      />
      <div className="p-8 space-y-4 bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-4xl font-bold">Interactive Demo</h1>
        <p className="text-slate-600 max-w-2xl">
          Scroll down to see the sticky header in action. The header stays at the top while
          you scroll through the content.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow">
              <h3 className="font-semibold mb-2">Feature {i + 1}</h3>
              <p className="text-sm text-slate-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
