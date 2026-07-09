import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Sheet } from './Sheet';
import { Button } from '../Button/Button';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible slide-out panel component perfect for mobile menus and sidebars.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Which side the sheet slides in from',
    },
    title: {
      control: 'text',
      description: 'Optional title displayed in the sheet header',
    },
    open: {
      control: 'boolean',
      description: 'Whether the sheet is currently open',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Whether clicking the overlay closes the sheet',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftSide: Story = {
  args: {
    side: 'left',
    title: 'Navigation',
    content: (
      <nav className="flex flex-col gap-2">
        <a href="#" className="px-2 py-1 hover:bg-slate-100 rounded">Home</a>
        <a href="#" className="px-2 py-1 hover:bg-slate-100 rounded">About</a>
        <a href="#" className="px-2 py-1 hover:bg-slate-100 rounded">Services</a>
        <a href="#" className="px-2 py-1 hover:bg-slate-100 rounded">Contact</a>
      </nav>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>Open Menu</Button>
    </Sheet>
  ),
};

export const RightSide: Story = {
  args: {
    side: 'right',
    title: 'Settings',
    content: (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label>Dark Mode</label>
          <input type="checkbox" />
        </div>
        <div className="flex items-center justify-between">
          <label>Notifications</label>
          <input type="checkbox" defaultChecked />
        </div>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button variant="secondary">Settings</Button>
    </Sheet>
  ),
};

export const TopSide: Story = {
  args: {
    side: 'top',
    title: 'Announcement',
    content: (
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm text-blue-900">
          Check out our new features released this week!
        </p>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>View Announcement</Button>
    </Sheet>
  ),
};

export const BottomSide: Story = {
  args: {
    side: 'bottom',
    title: 'Share',
    content: (
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Facebook
        </button>
        <button className="px-3 py-2 bg-slate-700 text-white rounded hover:bg-slate-800">
          Twitter
        </button>
        <button className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Pinterest
        </button>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button variant="outline">Share</Button>
    </Sheet>
  ),
};

export const MobileMenu: Story = {
  args: {
    side: 'left',
    title: 'Menu',
    content: (
      <nav className="flex flex-col gap-3">
        <a href="#" className="text-lg font-medium hover:text-blue-600">Home</a>
        <a href="#" className="text-lg font-medium hover:text-blue-600">Products</a>
        <a href="#" className="text-lg font-medium hover:text-blue-600">About</a>
        <a href="#" className="text-lg font-medium hover:text-blue-600">Blog</a>
        <hr className="my-2" />
        <a href="#" className="text-lg font-medium hover:text-blue-600">Sign In</a>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Sign Up
        </button>
      </nav>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>☰ Menu</Button>
    </Sheet>
  ),
};

export const WithoutCloseButton: Story = {
  args: {
    side: 'right',
    title: 'Dialog',
    closeButtonContent: false,
    content: (
      <div className="space-y-4">
        <p>This sheet has no close button - use overlay click to close</p>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>Open</Button>
    </Sheet>
  ),
};

export const CustomCloseButton: Story = {
  args: {
    side: 'left',
    title: 'Custom Close',
    closeButtonContent: '×',
    content: (
      <div>
        <p>This sheet has a custom close button</p>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>Open</Button>
    </Sheet>
  ),
};

export const NoTitle: Story = {
  args: {
    side: 'right',
    content: (
      <div className="space-y-2">
        <p className="font-semibold mb-4">Quick Actions</p>
        <button className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded">
          Profile
        </button>
        <button className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded">
          Preferences
        </button>
        <button className="w-full text-left px-3 py-2 hover:bg-slate-100 rounded">
          Logout
        </button>
      </div>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>Actions</Button>
    </Sheet>
  ),
};

export const SheetWithForm: Story = {
  args: {
    side: 'right',
    title: 'Contact Us',
    content: (
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-md"
            placeholder="Your message"
            rows={4}
          />
        </div>
        <Button className="w-full">Send Message</Button>
      </form>
    ),
  },
  render: (args) => (
    <Sheet {...args}>
      <Button>Get in Touch</Button>
    </Sheet>
  ),
};

export const AllSides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 justify-center">
      <Sheet
        side="left"
        title="Left"
        content={<p>Slides in from left</p>}
      >
        <Button>Left</Button>
      </Sheet>
      <Sheet
        side="right"
        title="Right"
        content={<p>Slides in from right</p>}
      >
        <Button>Right</Button>
      </Sheet>
      <Sheet
        side="top"
        title="Top"
        content={<p>Slides in from top</p>}
      >
        <Button>Top</Button>
      </Sheet>
      <Sheet
        side="bottom"
        title="Bottom"
        content={<p>Slides in from bottom</p>}
      >
        <Button>Bottom</Button>
      </Sheet>
    </div>
  ),
};
