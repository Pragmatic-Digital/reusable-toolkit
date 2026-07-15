import type { Meta, StoryObj } from '@storybook/react';
import { TestimonialCarousel } from './TestimonialCarousel';
import type { TestimonialProps } from './Testimonial';

const items: TestimonialProps[] = [
  {
    quote: 'This tool paid for itself within the first week. I only wish we had found it sooner.',
    author: 'Jordan Lee',
    authorRole: 'Head of Operations',
    company: 'Northwind',
    image: 'https://picsum.photos/id/64/128/128',
    imageAlt: 'Jordan Lee',
    rating: 5,
  },
  {
    quote: 'The onboarding was the smoothest I have experienced with any vendor, full stop.',
    author: 'Priya Nair',
    authorRole: 'CTO',
    company: 'Lumen',
    rating: 4.5,
  },
  {
    quote: 'Our team shipped in days what used to take months. The support is outstanding.',
    author: 'Marcus Bell',
    authorRole: 'Engineering Lead',
    company: 'Vertex',
    image: 'https://picsum.photos/id/91/128/128',
    imageAlt: 'Marcus Bell',
    rating: 5,
  },
];

const meta = {
  title: 'Components/TestimonialCarousel',
  component: TestimonialCarousel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A rotating set of testimonials following the ARIA APG carousel pattern: labelled slides, keyboard-operable previous/next and pagination, touch swipe, and optional autoplay that pauses on hover/focus and respects reduced-motion. Composes the base Testimonial component.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Variant applied to every slide',
      control: 'inline-radio',
      options: ['single', 'highlighted', 'compact'],
    },
    autoplay: { control: 'boolean' },
    autoplayInterval: { control: 'number' },
    loop: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 680 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TestimonialCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    testimonials: items,
    ariaLabel: 'Customer testimonials',
    variant: 'single',
  },
};

export const Highlighted: Story = {
  args: { ...Default.args, variant: 'highlighted' },
};

/** Autoplay pauses on hover/focus and never starts under prefers-reduced-motion. */
export const Autoplay: Story = {
  args: { ...Default.args, autoplay: true, autoplayInterval: 4000 },
};

/** Non-looping: the previous/next buttons disable at the ends. */
export const NoLoop: Story = {
  args: { ...Default.args, loop: false },
};

/** A single testimonial: controls are hidden, nothing looks broken. */
export const SingleItem: Story = {
  args: { ...Default.args, testimonials: [items[0]] },
};

export const Mobile: Story = {
  args: Default.args,
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
