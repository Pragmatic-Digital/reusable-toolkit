import type { Meta, StoryObj } from '@storybook/react';
import { CallToAction } from './CallToAction';

/** Public sample media, so no client assets leak into the library. */
const SAMPLE_IMAGE = 'https://picsum.photos/id/1018/1600/900';
const SAMPLE_VIDEO = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const SAMPLE_VIDEO_POSTER = 'https://picsum.photos/id/1015/1600/900';

const LONG_TITLE =
  'Partner with a team that ships accessible, performant digital products without compromising on craft';
const LONG_DESCRIPTION =
  'We work with organisations of every size to design, build and maintain digital products that stand up to real-world use. From discovery workshops through to long-term support, our teams embed alongside yours to deliver software that is fast, accessible and maintainable long after launch. Supercalifragilisticexpialidocious.';

/**
 * A flexible call-to-action section for the end of content blocks and
 * promotional spots.
 *
 * ## Features
 * - Backgrounds as a discriminated union: colour, gradient, image or video
 * - Optional overlay with configurable colour and opacity, for contrast
 * - Independent control of text alignment and content positioning
 * - One or more buttons, each rendering as a link or a button
 * - Renders correctly with nothing but a `title`
 *
 * ## Accessibility
 * - Heading level is configurable (`headingLevel`, default `h2`) so the CTA
 *   slots into the page outline without skipping levels
 * - Background media is hidden from assistive tech unless given alt text
 * - Background video is always muted and inline, and does not autoplay when
 *   the user prefers reduced motion
 */
const meta = {
  title: 'Components/CallToAction',
  component: CallToAction,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible CTA section supporting colour, gradient, image and video backgrounds, configurable overlay, alignment and content positioning.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'Section heading. The only required prop.',
      control: 'text',
    },
    description: {
      description: 'Supporting copy below the heading',
      control: 'text',
    },
    eyebrow: {
      description: 'Small label rendered above the heading',
      control: 'text',
    },
    alignment: {
      description: 'Text alignment within the content block',
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    contentPosition: {
      description: 'Where the content block sits within the section',
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    tone: {
      description:
        'Text colour scheme. Defaults to `light` over media/gradient, `dark` over solid colour.',
      control: 'inline-radio',
      options: [undefined, 'light', 'dark'],
    },
    headingLevel: {
      description: 'Heading level for the title, to preserve document outline',
      control: 'inline-radio',
      options: [1, 2, 3, 4, 5, 6],
    },
    background: {
      description: 'Discriminated union: colour | gradient | image | video',
      control: 'object',
    },
    overlay: {
      description: 'Contrast overlay. Omit entirely to render no overlay.',
      control: 'object',
    },
    minHeight: {
      description: 'Minimum section height, as any CSS length',
      control: 'text',
    },
    contentMaxWidth: {
      description: 'Constrains the width of the content block',
      control: 'text',
    },
    buttons: {
      description: 'One or more CTA buttons',
      control: 'object',
    },
  },
} satisfies Meta<typeof CallToAction>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Title, description and a single button — the most common shape. */
export const Default: Story = {
  args: {
    title: 'Ready to get started?',
    description: 'Talk to us about your next project and we will get back to you within two days.',
    buttons: [{ label: 'Book a call', href: '#contact' }],
  },
};

/** Everything except the title is optional. This must still look deliberate. */
export const TitleOnly: Story = {
  args: {
    title: 'Ready to get started?',
  },
};

/** The first button defaults to the primary variant, the rest to outline. */
export const MultipleButtons: Story = {
  args: {
    ...Default.args,
    buttons: [
      { label: 'Book a call', href: '#contact', variant: 'primary' },
      { label: 'See our work', href: '#work', variant: 'secondary' },
    ],
  },
};

/** An `onClick` button with no `href` renders a real `<button>`. */
export const ButtonWithClickHandler: Story = {
  args: {
    ...Default.args,
    buttons: [
      { label: 'Open the enquiry form', onClick: () => window.alert('Clicked') },
      { label: 'Read the docs', href: '#docs', variant: 'outline' },
    ],
  },
};

export const BackgroundColour: Story = {
  args: {
    ...Default.args,
    background: { type: 'colour', colour: '#0f172a' },
    tone: 'light',
  },
};

/** Any CSS gradient string works, including `var(--token)` colour stops. */
export const BackgroundGradient: Story = {
  args: {
    ...Default.args,
    background: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
    },
  },
};

export const BackgroundImageWithOverlay: Story = {
  args: {
    ...Default.args,
    background: { type: 'image', src: SAMPLE_IMAGE, loading: 'eager' },
    overlay: { colour: '#000000', opacity: 0.55 },
    minHeight: '32rem',
  },
};

/** Without an overlay, text over a busy image fails contrast. Compare with the story above. */
export const BackgroundImageNoOverlay: Story = {
  args: {
    ...BackgroundImageWithOverlay.args,
    overlay: undefined,
  },
};

/**
 * Muted, inline and looping. It will not autoplay if the OS is set to
 * "reduce motion" — the poster frame shows instead.
 */
export const BackgroundVideoWithOverlay: Story = {
  args: {
    ...Default.args,
    background: {
      type: 'video',
      src: SAMPLE_VIDEO,
      poster: SAMPLE_VIDEO_POSTER,
    },
    overlay: { colour: '#0f172a', opacity: 0.6 },
    minHeight: '32rem',
  },
};

/** Multiple sources let the browser pick the format it supports. */
export const BackgroundVideoMultipleSources: Story = {
  args: {
    ...BackgroundVideoWithOverlay.args,
    background: {
      type: 'video',
      src: [
        { src: SAMPLE_VIDEO, type: 'video/mp4' },
        { src: SAMPLE_VIDEO, type: 'video/webm' },
      ],
      poster: SAMPLE_VIDEO_POSTER,
    },
  },
};

export const AlignmentLeft: Story = {
  args: { ...Default.args, alignment: 'left', ...MultipleButtons.args },
};

export const AlignmentCenter: Story = {
  args: { ...MultipleButtons.args, alignment: 'center' },
};

export const AlignmentRight: Story = {
  args: { ...MultipleButtons.args, alignment: 'right' },
};

/**
 * `contentPosition` moves the block; `alignment` sets the text within it.
 * Here the block sits left against the image while its text stays left-aligned.
 */
export const ContentPositionLeftOverImage: Story = {
  args: {
    ...MultipleButtons.args,
    background: { type: 'image', src: SAMPLE_IMAGE, loading: 'eager' },
    overlay: { opacity: 0.5 },
    contentPosition: 'left',
    alignment: 'left',
    minHeight: '32rem',
  },
};

export const ContentPositionRightOverImage: Story = {
  args: {
    ...ContentPositionLeftOverImage.args,
    contentPosition: 'right',
    alignment: 'right',
  },
};

/** Block centred, text centred — the default arrangement, shown over an image. */
export const ContentPositionCentreOverImage: Story = {
  args: {
    ...ContentPositionLeftOverImage.args,
    contentPosition: 'center',
    alignment: 'center',
  },
};

/** The block sits left, but its text is centred — the two props are independent. */
export const ContentPositionLeftTextCentre: Story = {
  args: {
    ...ContentPositionLeftOverImage.args,
    contentPosition: 'left',
    alignment: 'center',
  },
};

/** Guards against overflow and broken wrapping when a client pastes in an essay. */
export const LongCopy: Story = {
  args: {
    eyebrow: 'Working together',
    title: LONG_TITLE,
    description: LONG_DESCRIPTION,
    background: { type: 'image', src: SAMPLE_IMAGE, loading: 'eager' },
    overlay: { opacity: 0.6 },
    alignment: 'left',
    contentPosition: 'left',
    buttons: [
      { label: 'Start a conversation with our team', href: '#contact' },
      { label: 'Read the case studies', href: '#work', variant: 'outline' },
      { label: 'Download our capability statement', href: '#pdf', variant: 'outline' },
    ],
  },
};

/** Narrow viewport, to check stacking and that buttons wrap rather than overflow. */
export const Mobile: Story = {
  args: {
    ...LongCopy.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

/**
 * The CTA is a section within a page, so it defaults to `h2`. Override
 * `headingLevel` when the surrounding outline calls for something else.
 */
export const CustomHeadingLevel: Story = {
  args: {
    ...Default.args,
    headingLevel: 3,
  },
};

/** `children` replaces the default title/description/buttons content entirely. */
export const CustomChildren: Story = {
  args: {
    title: 'Used as the accessible name only',
    background: { type: 'gradient', gradient: 'linear-gradient(90deg, #db2777, #f97316)' },
    children: (
      <div className="text-white">
        <h2 className="text-4xl font-bold">Bring your own content</h2>
        <p className="mt-4">Anything can go here — a form, a stat row, a testimonial.</p>
      </div>
    ),
  },
};
