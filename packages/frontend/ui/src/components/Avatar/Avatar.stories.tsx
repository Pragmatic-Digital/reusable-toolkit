import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible avatar component displaying user images with fallback initials.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl'],
      description: 'Size of the avatar',
    },
    src: {
      control: 'text',
      description: 'Image URL',
    },
    alt: {
      control: 'text',
      description: 'Alternative text for image',
    },
    initials: {
      control: 'text',
      description: 'Fallback initials',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alt: 'Jane Doe',
    initials: 'JD',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    alt: 'Sarah Anderson',
  },
};

export const Small: Story = {
  args: {
    alt: 'John Smith',
    initials: 'JS',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    alt: 'Alex Brown',
    initials: 'AB',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    alt: 'Chris Wilson',
    initials: 'CW',
    size: 'xl',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="User" initials="XS" size="xs" />
      <Avatar alt="User" initials="SM" size="sm" />
      <Avatar alt="User" initials="MD" size="default" />
      <Avatar alt="User" initials="LG" size="lg" />
      <Avatar alt="User" initials="XL" size="xl" />
    </div>
  ),
};

export const WithCustomBackground: Story = {
  args: {
    alt: 'User',
    initials: 'CB',
    bgColour: 'bg-blue-100',
  },
};

export const Group: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar alt="Jane" initials="JD" />
      <Avatar alt="John" initials="JS" />
      <Avatar alt="Sarah" initials="SA" />
    </div>
  ),
};
