import type { Meta, StoryObj } from '@storybook/react';
import { ImageText } from './ImageText';

const IMAGE = 'https://picsum.photos/id/1015/1200/900';
const PORTRAIT = 'https://picsum.photos/id/1025/900/1200';

const LONG_DESCRIPTION =
  'We embed alongside your team from discovery through to launch and beyond. Every engagement starts with understanding the problem properly, not jumping to a solution — and it ends with software your team can actually maintain. Along the way we obsess over the details that make a product feel considered: performance budgets, accessibility, the copy in an empty state, the supercalifragilisticexpialidocious little moments of delight that add up to trust.';

const meta = {
  title: 'Components/ImageText',
  component: ImageText,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A side-by-side image and text section for about blocks, process steps and feature explanations. Image side, aspect ratio, treatment (contained vs full-bleed), mobile stack order and text alignment are all prop-driven. Stacks to a single column on mobile.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    overline: { control: 'text' },
    image: { control: 'text' },
    imageAlt: { control: 'text' },
    imagePosition: { description: 'Image side at desktop', control: 'inline-radio', options: ['left', 'right'] },
    layout: { description: 'Image treatment', control: 'inline-radio', options: ['contained', 'full-bleed'] },
    mobileOrder: { description: 'Which block is first when stacked', control: 'inline-radio', options: ['image-first', 'text-first'] },
    textAlign: { description: 'Text alignment in the text column', control: 'inline-radio', options: ['left', 'center'] },
    aspectRatio: { description: 'CSS aspect-ratio for the image', control: 'text' },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    cta: { control: 'object' },
  },
} satisfies Meta<typeof ImageText>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs = {
  image: IMAGE,
  imageAlt: 'Our team collaborating around a table',
  overline: 'Our process',
  title: 'From idea to launch, together',
  description: 'We work alongside your team at every stage, from first sketch to production and beyond.',
  cta: { label: 'Learn more', href: '#process' },
};

/** Image left, with overline, description and CTA — the standard shape. */
export const Default: Story = {
  args: { ...baseArgs, imagePosition: 'left' },
};

export const ImageRight: Story = {
  args: { ...baseArgs, imagePosition: 'right' },
};

export const WithOverline: Story = {
  args: { ...baseArgs, overline: 'Our process' },
};

export const WithoutOverline: Story = {
  args: { ...baseArgs, overline: undefined },
};

/** Only the required props — image and title. Must still look deliberate. */
export const TitleOnly: Story = {
  args: {
    image: IMAGE,
    imageAlt: 'Our team collaborating around a table',
    title: 'A quietly minimal section',
    overline: undefined,
    description: undefined,
    cta: undefined,
  },
};

export const NoCta: Story = {
  args: { ...baseArgs, cta: undefined },
};

/** Full-bleed treatment — image fills its half edge-to-edge, no rounding. */
export const FullBleed: Story = {
  args: { ...baseArgs, layout: 'full-bleed', imagePosition: 'right' },
};

export const AspectSquare: Story = {
  args: { ...baseArgs, aspectRatio: '1 / 1' },
};

export const AspectWide: Story = {
  args: { ...baseArgs, aspectRatio: '16 / 9' },
};

export const AspectPortrait: Story = {
  args: { ...baseArgs, image: PORTRAIT, aspectRatio: '3 / 4' },
};

export const TextCentered: Story = {
  args: { ...baseArgs, textAlign: 'center' },
};

/** Long description, to check wrapping and that columns stay balanced. */
export const LongDescription: Story = {
  args: { ...baseArgs, description: LONG_DESCRIPTION },
};

/** CTA as an onClick button (no href) rather than a link. */
export const CtaAsButton: Story = {
  args: {
    ...baseArgs,
    cta: { label: 'Start now', variant: 'primary', onClick: () => window.alert('Clicked') },
  },
};

/** Text-first on mobile: resize narrow to see the text block stack above the image. */
export const MobileTextFirst: Story = {
  args: { ...baseArgs, mobileOrder: 'text-first' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};

/** Default (image-first) stacking on a narrow viewport. */
export const Mobile: Story = {
  args: { ...baseArgs, description: LONG_DESCRIPTION },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
