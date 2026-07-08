import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible visual divider for separating content sections.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the separator',
    },
    decorative: {
      control: 'text',
      description: 'Text to display in the centre of the separator',
    },
    isDecorative: {
      control: 'boolean',
      description: 'Whether this is purely decorative (aria-hidden)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="flex gap-4 h-20">
      <div>Left</div>
      <Separator orientation="vertical" />
      <div>Right</div>
    </div>
  ),
};

export const WithDecorative: Story = {
  args: {
    decorative: 'OR',
  },
};

export const WithDecorativeText: Story = {
  args: {
    decorative: 'Section Break',
  },
};

export const NotDecorative: Story = {
  args: {
    isDecorative: false,
  },
};

export const InContext: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <section>
        <h2 className="text-lg font-semibold mb-2">Section 1</h2>
        <p className="text-slate-600">This is the first section</p>
      </section>
      <Separator />
      <section>
        <h2 className="text-lg font-semibold mb-2">Section 2</h2>
        <p className="text-slate-600">This is the second section</p>
      </section>
    </div>
  ),
};

export const WithCentredText: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <div className="mb-4 text-slate-600">Option A</div>
      <Separator decorative="OR" />
      <div className="mt-4 text-slate-600">Option B</div>
    </div>
  ),
};
