import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DropdownMenu } from './DropdownMenu';
import { Avatar } from '../Avatar';

const meta: Meta<typeof DropdownMenu> = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible dropdown menu for actions, profiles, and settings.',
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
      { label: 'Profile', onClick: () => console.log('Profile') },
      { label: 'Settings', onClick: () => console.log('Settings') },
      { label: 'Logout', onClick: () => console.log('Logout'), variant: 'destructive' },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">
        Menu
      </button>
    </DropdownMenu>
  ),
};

export const WithTitle: Story = {
  args: {
    title: 'User Menu',
    items: [
      { label: 'My Profile' },
      { label: 'Account Settings' },
      { label: 'Help & Support' },
      { label: 'Sign Out', variant: 'destructive' },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">
        User
      </button>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        label: 'Profile',
        icon: '👤',
        onClick: () => console.log('Profile'),
      },
      {
        label: 'Settings',
        icon: '⚙️',
        onClick: () => console.log('Settings'),
      },
      {
        label: 'Help',
        icon: '❓',
        onClick: () => console.log('Help'),
      },
      {
        label: 'Logout',
        icon: '🚪',
        onClick: () => console.log('Logout'),
        variant: 'destructive',
      },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">
        Actions
      </button>
    </DropdownMenu>
  ),
};

export const UserProfile: Story = {
  args: {
    title: 'Account',
    items: [
      { label: 'View Profile', onClick: () => console.log('View Profile') },
      { label: 'Edit Profile', onClick: () => console.log('Edit Profile') },
      { label: 'Privacy Settings', onClick: () => console.log('Privacy Settings') },
      { label: 'Notifications', onClick: () => console.log('Notifications') },
      { label: 'Sign Out', variant: 'destructive', onClick: () => console.log('Sign Out') },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-100">
        <Avatar alt="User" initials="JD" size="sm" />
        <span className="text-sm font-medium">John Doe</span>
      </button>
    </DropdownMenu>
  ),
};

export const ActionsMenu: Story = {
  args: {
    title: 'Actions',
    items: [
      { label: 'Edit', onClick: () => console.log('Edit') },
      { label: 'Duplicate', onClick: () => console.log('Duplicate') },
      { label: 'Archive', onClick: () => console.log('Archive') },
      { label: 'Delete', variant: 'destructive', onClick: () => console.log('Delete') },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="px-2 py-1 text-slate-600 hover:bg-slate-100 rounded">
        ⋯
      </button>
    </DropdownMenu>
  ),
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { label: 'Enabled Action', onClick: () => console.log('Enabled') },
      { label: 'Disabled Action', disabled: true },
      { label: 'Another Enabled', onClick: () => console.log('Enabled') },
    ],
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <button className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200">
        Options
      </button>
    </DropdownMenu>
  ),
};
