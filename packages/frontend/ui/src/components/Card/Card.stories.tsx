import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

/** Public sample media, so no client assets leak into the library. */
const SAMPLE_IMAGE = 'https://picsum.photos/id/1018/800/450';
const SAMPLE_IMAGE_2 = 'https://picsum.photos/id/1025/800/450';
const SAMPLE_IMAGE_3 = 'https://picsum.photos/id/1035/800/450';

const LONG_TITLE =
  'How our team rebuilt an entire design system from the ground up in a single quarter without downtime';
const LONG_EXCERPT =
  'A deep dive into the decisions, trade-offs and occasional dead ends behind a full design-system migration. We cover tokenisation, component APIs, accessibility budgets, the tooling that kept everyone honest, and the supercalifragilisticexpialidocious moment it all clicked into place across a dozen product teams.';

/**
 * A generic content card for listings — blog posts, team members, portfolio
 * items.
 *
 * ## Features
 * - Lazy-loaded image with a fixed aspect ratio, so grids stay aligned
 * - Optional badge, excerpt and footer action — nothing renders when omitted
 * - Footer action as a text link or a solid button
 * - `interactive` makes the whole card clickable via a stretched title link
 * - Themeable hover effect (`lift`, `zoom`, `border`, `none`)
 *
 * ## Accessibility
 * - Configurable heading level (`headingLevel`, default `h3`)
 * - Interactive mode keeps a single tab stop, named by the heading
 * - Hover feedback is mirrored on focus-within, so it never hides the focus ring
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible, layout-agnostic content card with optional badge, excerpt and footer action, plus optional whole-card interactivity.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { description: 'Card heading (required)', control: 'text' },
    image: { description: 'Image URL — CMS or static asset', control: 'text' },
    imageAlt: { description: 'Alt text; empty string for decorative images', control: 'text' },
    excerpt: { description: 'Supporting copy below the title', control: 'text' },
    badge: { description: 'Optional badge/tag label', control: 'text' },
    badgeVariant: {
      description: 'Badge tone',
      control: 'inline-radio',
      options: ['default', 'accent', 'muted', 'outline'],
    },
    hoverEffect: {
      description: 'Hover feedback style',
      control: 'inline-radio',
      options: ['lift', 'zoom', 'border', 'none'],
    },
    interactive: {
      description: 'Whole card clickable (requires action.href)',
      control: 'boolean',
    },
    headingLevel: {
      description: 'Heading level for the title',
      control: 'inline-radio',
      options: [2, 3, 4, 5, 6],
    },
    excerptLines: { description: 'Clamp excerpt to N lines', control: 'number' },
    action: { description: 'Footer action', control: 'object' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Image, title, excerpt and a link-style footer action — the common shape. */
export const Default: Story = {
  args: {
    image: SAMPLE_IMAGE,
    imageAlt: 'A winding mountain road at dusk',
    title: 'Designing for the long term',
    excerpt: 'Why we optimise component APIs for the teams who will use them next year.',
    action: { label: 'Read more', href: '#post' },
  },
};

/** Everything except image and title is optional. Must still look deliberate. */
export const ImageAndTitleOnly: Story = {
  args: {
    image: SAMPLE_IMAGE,
    imageAlt: 'A winding mountain road at dusk',
    title: 'A quietly minimal card',
  },
};

export const WithBadge: Story = {
  args: {
    ...Default.args,
    badge: 'New',
    badgeVariant: 'accent',
  },
};

/** Contrast with the story above — badge occupies no space when absent. */
export const WithoutBadge: Story = {
  args: {
    ...Default.args,
  },
};

export const LinkStyleFooter: Story = {
  args: {
    ...Default.args,
    action: { label: 'Read more', href: '#post', variant: 'link' },
  },
};

export const ButtonStyleFooter: Story = {
  args: {
    ...Default.args,
    action: { label: 'View project', href: '#project', variant: 'button' },
  },
};

/** A footer action with an `onClick` and no `href` renders a real `<button>`. */
export const ButtonWithClickHandler: Story = {
  args: {
    ...Default.args,
    action: {
      label: 'Add to shortlist',
      variant: 'button',
      onClick: () => window.alert('Shortlisted'),
    },
  },
};

/**
 * Whole card is clickable. The title is the link; the footer becomes a visual
 * affordance. Hover anywhere on the card — one tab stop, named by the heading.
 */
export const InteractiveWholeCard: Story = {
  args: {
    ...Default.args,
    badge: 'Case study',
    badgeVariant: 'accent',
    interactive: true,
  },
};

export const HoverZoom: Story = {
  args: { ...Default.args, hoverEffect: 'zoom' },
};

export const HoverBorder: Story = {
  args: { ...Default.args, hoverEffect: 'border' },
};

export const HoverNone: Story = {
  args: { ...Default.args, hoverEffect: 'none' },
};

/** Long title and excerpt, wrapping freely — check nothing overflows the frame. */
export const LongContent: Story = {
  args: {
    ...Default.args,
    badge: 'Engineering',
    badgeVariant: 'muted',
    title: LONG_TITLE,
    excerpt: LONG_EXCERPT,
  },
};

/** The same long copy, with the excerpt clamped to three lines. */
export const ClampedExcerpt: Story = {
  args: {
    ...LongContent.args,
    excerptLines: 3,
  },
};

/** No image supplied — the built-in placeholder keeps the frame and alignment. */
export const NoImagePlaceholder: Story = {
  args: {
    title: 'A card without a hero image',
    excerpt: 'The placeholder preserves the aspect ratio so grids stay aligned.',
    action: { label: 'Read more', href: '#post' },
  },
};

/** A team-member framing: square image, role badge, "View profile" action. */
export const TeamMember: Story = {
  args: {
    image: SAMPLE_IMAGE_2,
    imageAlt: 'Portrait of Alex Rivera',
    imageAspectRatio: '1 / 1',
    badge: 'Design Lead',
    badgeVariant: 'outline',
    title: 'Alex Rivera',
    excerpt: 'Leads the design systems practice and once named a colour “Beige-ish”.',
    action: { label: 'View profile', href: '#profile' },
    interactive: true,
  },
};

/** Multiple cards together, to sanity-check spacing and alignment in context. */
export const Grid: Story = {
  args: Default.args,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 24,
          width: 880,
        }}
      >
        <Story />
      </div>
    ),
  ],
  render: () => (
    <>
      <Card
        image={SAMPLE_IMAGE}
        imageAlt="A winding mountain road at dusk"
        badge="New"
        badgeVariant="accent"
        title="Short title"
        excerpt="A brief excerpt."
        action={{ label: 'Read more', href: '#a' }}
        interactive
      />
      <Card
        image={SAMPLE_IMAGE_2}
        imageAlt="City skyline at night"
        title="A noticeably longer title that runs onto two or three lines"
        excerpt="A longer excerpt that pushes the body height further than its neighbours, to prove the footers still line up along the bottom edge."
        action={{ label: 'Read more', href: '#b' }}
        interactive
      />
      <Card
        image={SAMPLE_IMAGE_3}
        imageAlt="Forest path in autumn"
        badge="Guide"
        badgeVariant="muted"
        title="Third card"
        action={{ label: 'Read more', href: '#c' }}
        interactive
      />
      <Card
        title="No image, still aligned"
        excerpt="The placeholder keeps this card the same shape as the others."
        action={{ label: 'Read more', href: '#d' }}
        interactive
      />
    </>
  ),
};

/** Narrow viewport, to check the card holds up at mobile widths. */
export const Mobile: Story = {
  args: {
    ...Default.args,
    badge: 'New',
    badgeVariant: 'accent',
    title: LONG_TITLE,
    excerpt: LONG_EXCERPT,
    excerptLines: 4,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
