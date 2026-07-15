import type { Meta, StoryObj } from '@storybook/react';
import { FeatureGrid } from './FeatureGrid';
import type { Feature } from './FeatureGrid';

/** A tiny inline SVG so stories stay self-contained and icon-library-agnostic. */
const Icon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-full w-full">
    <path d={path} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoltIcon = () => <Icon path="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />;
const ShieldIcon = () => <Icon path="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />;
const HeartIcon = () => <Icon path="M12 21C5 14.5 3 11 3 8a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1c0 3-2 6.5-9 13Z" />;
const GlobeIcon = () => <Icon path="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c3 3 3 15 0 18M3 12h18" />;
const SparkIcon = () => <Icon path="M12 3v6m0 6v6m9-9h-6m-6 0H3" />;

const IMAGE_1 = 'https://picsum.photos/id/1062/96/96';
const IMAGE_2 = 'https://picsum.photos/id/1080/96/96';
const IMAGE_3 = 'https://picsum.photos/id/1084/96/96';

const iconFeatures: Feature[] = [
  { icon: <BoltIcon />, title: 'Blazing fast', description: 'Sub-second page loads on every device, everywhere.' },
  { icon: <ShieldIcon />, title: 'Secure by default', description: 'SOC 2 Type II, encryption at rest and in transit.' },
  { icon: <HeartIcon />, title: 'Loved by teams', description: 'A workflow your colleagues will actually thank you for.' },
];

const fourIconFeatures: Feature[] = [
  ...iconFeatures,
  { icon: <GlobeIcon />, title: 'Global by design', description: 'Edge-delivered in every region you operate in.' },
];

const imageFeatures: Feature[] = [
  { image: IMAGE_1, imageAlt: '', title: 'Analytics', description: 'Understand what your users actually do.' },
  { image: IMAGE_2, imageAlt: '', title: 'Automation', description: 'Let the boring work run itself.' },
  { image: IMAGE_3, imageAlt: '', title: 'Integrations', description: 'Connects to the tools you already use.' },
];

const meta = {
  title: 'Components/FeatureGrid',
  component: FeatureGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A responsive grid for product features, services or benefits. Each feature has an icon or image, heading, description and optional badge. Columns and per-card layout are prop-driven.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      description: 'Columns at the largest breakpoint',
      control: 'inline-radio',
      options: [2, 3, 4],
    },
    layout: {
      description: 'Per-card arrangement',
      control: 'inline-radio',
      options: ['stacked', 'horizontal'],
    },
    gap: { description: 'Grid gap', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    headingLevel: {
      description: 'Heading level per feature',
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6],
    },
    iconSize: { description: 'Icon/image box size (px)', control: 'number' },
    features: { control: 'object' },
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 3 features, stacked, 3 columns — the standard arrangement. */
export const Default: Story = {
  args: {
    features: iconFeatures,
    ariaLabel: 'Product features',
  },
};

export const TwoColumns: Story = {
  args: { columns: 2, features: iconFeatures.slice(0, 2), ariaLabel: 'Product features' },
};

export const ThreeColumns: Story = {
  args: { columns: 3, features: iconFeatures, ariaLabel: 'Product features' },
};

export const FourColumns: Story = {
  args: { columns: 4, features: fourIconFeatures, ariaLabel: 'Product features' },
};

export const WithBadges: Story = {
  args: {
    columns: 3,
    ariaLabel: 'Product features',
    features: [
      { ...iconFeatures[0], badge: 'New', badgeVariant: 'accent' },
      iconFeatures[1],
      { ...iconFeatures[2], badge: 'Popular', badgeVariant: 'muted' },
    ],
  },
};

export const IconFeatures: Story = {
  args: { columns: 3, features: iconFeatures, ariaLabel: 'Product features' },
};

export const ImageFeatures: Story = {
  args: { columns: 3, features: imageFeatures, ariaLabel: 'Product features' },
};

/** Icons and images side by side in one grid — the component assumes neither. */
export const MixedIconAndImage: Story = {
  args: {
    columns: 4,
    ariaLabel: 'Product features',
    features: [
      iconFeatures[0],
      imageFeatures[0],
      iconFeatures[1],
      imageFeatures[1],
    ],
  },
};

/** Icon-left arrangement — the alternate layout variant. */
export const HorizontalLayout: Story = {
  args: { columns: 2, layout: 'horizontal', features: fourIconFeatures, ariaLabel: 'Product features' },
};

/** A single feature must not look like a broken one-cell grid. */
export const SingleFeature: Story = {
  args: { columns: 3, features: [iconFeatures[0]], ariaLabel: 'Product features' },
};

/** 5 features in a 4-column grid — check the fifth wraps and aligns cleanly. */
export const OddNumberInGrid: Story = {
  args: {
    columns: 4,
    ariaLabel: 'Product features',
    features: [...fourIconFeatures, { icon: <SparkIcon />, title: 'Extensible', description: 'Build on top with a full API.' }],
  },
};

/** Long headings and descriptions, to check wrapping doesn't break the layout. */
export const LongContent: Story = {
  args: {
    columns: 3,
    ariaLabel: 'Product features',
    features: [
      {
        icon: <BoltIcon />,
        title: 'Exceptionally, remarkably, almost unreasonably fast performance across the board',
        description:
          'Every interaction is measured against a strict performance budget, so the experience stays fast even as the product grows in scope and complexity over many years of active development. Supercalifragilisticexpialidocious.',
        badge: 'Benchmarked',
        badgeVariant: 'outline',
      },
      iconFeatures[1],
      iconFeatures[2],
    ],
  },
};

/** Whole cards clickable via a stretched title link — one tab stop each. */
export const LinkedFeatures: Story = {
  args: {
    columns: 3,
    ariaLabel: 'Product features',
    features: iconFeatures.map((f, i) => ({ ...f, href: `#feature-${i}` })),
  },
};

/** Narrow viewport, to confirm the grid collapses to a single column. */
export const Mobile: Story = {
  args: { columns: 4, features: fourIconFeatures, ariaLabel: 'Product features' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
