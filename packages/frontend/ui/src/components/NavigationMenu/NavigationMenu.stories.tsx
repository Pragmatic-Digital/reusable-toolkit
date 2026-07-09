import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NavigationMenu } from './NavigationMenu';

const meta: Meta<typeof NavigationMenu> = {
  title: 'Components/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible navigation menu component for main site navigation and mega menus.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Products' },
        content: [
          { label: 'Featured', href: '#featured' },
          { label: 'New Arrivals', href: '#new' },
          { label: 'Best Sellers', href: '#bestsellers' },
        ],
      },
      {
        trigger: { label: 'Services' },
        content: [
          { label: 'Consulting', href: '#consulting' },
          { label: 'Support', href: '#support' },
          { label: 'Training', href: '#training' },
        ],
      },
      {
        trigger: { label: 'Company' },
        content: [
          { label: 'About Us', href: '#about' },
          { label: 'Careers', href: '#careers' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Products', icon: '📦' },
        content: [
          { label: 'Electronics', href: '#electronics', icon: '📱' },
          { label: 'Clothing', href: '#clothing', icon: '👕' },
          { label: 'Books', href: '#books', icon: '📚' },
        ],
      },
      {
        trigger: { label: 'Services', icon: '🛠️' },
        content: [
          { label: 'Installation', href: '#installation', icon: '🔧' },
          { label: 'Repair', href: '#repair', icon: '🔨' },
          { label: 'Maintenance', href: '#maintenance', icon: '⚙️' },
        ],
      },
    ],
  },
};

export const WithDescriptions: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Solutions' },
        description: 'Explore our comprehensive solutions',
        content: [
          { label: 'Enterprise', href: '#enterprise' },
          { label: 'Startup', href: '#startup' },
          { label: 'Personal', href: '#personal' },
        ],
      },
      {
        trigger: { label: 'Resources' },
        description: 'Learn and grow with us',
        content: [
          { label: 'Documentation', href: '#docs' },
          { label: 'Tutorials', href: '#tutorials' },
          { label: 'Blog', href: '#blog' },
        ],
      },
    ],
  },
};

export const SimpleMenu: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Home' },
        content: [],
      },
      {
        trigger: { label: 'About' },
        content: [
          { label: 'Our Story', href: '#story' },
          { label: 'Team', href: '#team' },
        ],
      },
      {
        trigger: { label: 'Contact' },
        content: [
          { label: 'Email', href: 'mailto:hello@example.com' },
          { label: 'Phone', href: 'tel:+1234567890' },
        ],
      },
    ],
  },
};

export const MegaMenu: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Categories' },
        description: 'Browse by category',
        content: [
          { label: '🏠 Home & Garden', href: '#home' },
          { label: '👗 Fashion & Accessories', href: '#fashion' },
          { label: '⚽ Sports & Outdoors', href: '#sports' },
          { label: '📚 Books & Media', href: '#books' },
          { label: '💻 Electronics', href: '#electronics' },
          { label: '🍽️ Kitchen & Dining', href: '#kitchen' },
        ],
      },
      {
        trigger: { label: 'Quick Links' },
        content: [
          { label: 'New Releases', href: '#new' },
          { label: 'Trending Now', href: '#trending' },
          { label: 'On Sale', href: '#sale' },
          { label: 'Coming Soon', href: '#soon' },
        ],
      },
    ],
  },
};

export const WithCustomContent: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Account' },
        content: (
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Logged in as</h3>
              <p className="text-xs text-slate-600">john@example.com</p>
            </div>
            <div className="border-t pt-2">
              <button className="w-full text-left px-2 py-1 text-sm hover:bg-slate-100 rounded">
                Profile Settings
              </button>
              <button className="w-full text-left px-2 py-1 text-sm hover:bg-slate-100 rounded">
                Security
              </button>
              <button className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                Sign Out
              </button>
            </div>
          </div>
        ),
      },
    ],
  },
};

export const VerticalOrientation: Story = {
  args: {
    orientation: 'vertical',
    items: [
      {
        trigger: { label: 'Menu 1' },
        content: [
          { label: 'Item 1', href: '#1' },
          { label: 'Item 2', href: '#2' },
        ],
      },
      {
        trigger: { label: 'Menu 2' },
        content: [
          { label: 'Item 3', href: '#3' },
          { label: 'Item 4', href: '#4' },
        ],
      },
    ],
  },
};

export const Minimal: Story = {
  args: {
    items: [
      {
        trigger: { label: 'Products' },
        content: [
          { label: 'All Products', href: '#all' },
        ],
      },
    ],
  },
};

export const ComprehensiveExample: Story = {
  render: () => (
    <div className="w-full bg-slate-50 p-4">
      <NavigationMenu
        items={[
          {
            trigger: { label: '🏠 Products', icon: '📦' },
            description: 'Explore our full product range',
            content: [
              { label: '⭐ Featured Items', href: '#featured' },
              { label: '🆕 New Arrivals', href: '#new' },
              { label: '🔥 Trending', href: '#trending' },
              { label: '💰 On Sale', href: '#sale' },
            ],
          },
          {
            trigger: { label: '📖 Documentation', icon: '📚' },
            description: 'Learn how to use our products',
            content: [
              { label: '📖 Getting Started', href: '#started' },
              { label: '🎓 Tutorials', href: '#tutorials' },
              { label: '🔧 API Reference', href: '#api' },
              { label: '❓ FAQ', href: '#faq' },
            ],
          },
          {
            trigger: { label: '🤝 Community', icon: '👥' },
            description: 'Connect with other users',
            content: [
              { label: '💬 Forums', href: '#forums' },
              { label: '🐛 Report Issues', href: '#issues' },
              { label: '💡 Feature Requests', href: '#features' },
              { label: '🎉 Events', href: '#events' },
            ],
          },
        ]}
      />
    </div>
  ),
};
