import type { Meta, StoryObj } from '@storybook/react';
import { Testimonial } from './Testimonial';

const PHOTO = 'https://picsum.photos/id/64/128/128';

const LONG_QUOTE =
  'Adopting this platform reshaped how our whole organisation works. What used to take a cross-functional team the better part of a fortnight now happens in an afternoon, and the results are more consistent than anything we produced by hand. The support team have been genuinely, supercalifragilisticexpialidociously responsive throughout.';

const meta = {
  title: 'Components/Testimonial',
  component: Testimonial,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A social-proof quote with author attribution, optional photo and optional fractional star rating, in single, highlighted or compact variants. Uses semantic figure/blockquote/figcaption markup.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    quote: { control: 'text' },
    author: { control: 'text' },
    company: { control: 'text' },
    authorRole: { control: 'text' },
    image: { control: 'text' },
    rating: { description: 'Supports fractions, e.g. 4.5', control: { type: 'number', min: 0, max: 5, step: 0.5 } },
    variant: {
      description: 'Visual variant',
      control: 'inline-radio',
      options: ['single', 'highlighted', 'compact'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Testimonial>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Quote, author, company and photo — the standard shape. */
export const Default: Story = {
  args: {
    quote: 'This tool paid for itself within the first week. I only wish we had found it sooner.',
    author: 'Jordan Lee',
    authorRole: 'Head of Operations',
    company: 'Northwind',
    image: PHOTO,
    imageAlt: 'Jordan Lee',
  },
};

/** Only the required props — quote and author. Must still look deliberate. */
export const QuoteAndAuthorOnly: Story = {
  args: {
    quote: 'Simple, fast, and it just works.',
    author: 'Sam Carter',
  },
};

/** No photo supplied — falls back to an initials avatar, never a broken image. */
export const NoPhotoFallback: Story = {
  args: {
    quote: 'The onboarding was the smoothest I have experienced with any vendor.',
    author: 'Priya Nair',
    authorRole: 'CTO',
    company: 'Lumen',
  },
};

export const WithRating: Story = {
  args: { ...Default.args, rating: 5 },
};

export const WithoutRating: Story = {
  args: { ...Default.args },
};

/** Fractional rating — the fill clips to the exact proportion; label reads "4.5 out of 5 stars". */
export const FractionalRating: Story = {
  args: { ...Default.args, rating: 4.5 },
};

export const SingleVariant: Story = {
  args: { ...Default.args, rating: 5, variant: 'single' },
};

export const HighlightedVariant: Story = {
  args: { ...Default.args, rating: 5, variant: 'highlighted' },
};

export const CompactVariant: Story = {
  args: { ...Default.args, rating: 4, variant: 'compact' },
};

/** All three variants together, to confirm they are visually distinct. */
export const AllVariants: Story = {
  args: Default.args,
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Testimonial {...args} variant="highlighted" rating={5} />
      <Testimonial {...args} variant="single" rating={4.5} />
      <Testimonial {...args} variant="compact" rating={4} />
    </div>
  ),
};

/** Long quote, to check wrapping does not break the layout. */
export const LongQuote: Story = {
  args: {
    ...Default.args,
    rating: 4.5,
    quote: LONG_QUOTE,
  },
};

/** Narrow viewport. */
export const Mobile: Story = {
  args: { ...Default.args, rating: 4.5, quote: LONG_QUOTE },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
