import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero';

/**
 * A versatile hero section component that supports multiple background types,
 * flexible layouts, and comprehensive accessibility features.
 *
 * ## Features
 * - Multiple background types: image, video, gradient, solid colour
 * - Configurable overlay with opacity control
 * - Three layout variants: centered, left-aligned, right-aligned
 * - Fully responsive design (mobile-first)
 * - WCAG 2.1 AA accessibility compliance
 * - Multiple CTA button support
 *
 * ## Accessibility
 * All Hero components are built with accessibility in mind:
 * - Semantic HTML structure with proper heading hierarchy
 * - ARIA labels for non-text content and button groups
 * - Keyboard navigation support (Tab, Enter)
 * - High contrast text over backgrounds
 * - Focus indicators for interactive elements
 * - Video background support with mute/autoplay
 */
const meta = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A versatile hero section component with support for multiple backgrounds, layouts, and full accessibility compliance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      description: 'The main heading text',
      control: 'text',
    },
    subtitle: {
      description: 'Secondary heading text (optional)',
      control: 'text',
    },
    description: {
      description: 'Description text below the subtitle (optional)',
      control: 'text',
    },
    backgroundType: {
      description: 'Type of background to display',
      control: 'select',
      options: ['colour', 'image', 'gradient', 'video'],
    },
    layout: {
      description: 'Content alignment and positioning',
      control: 'select',
      options: ['centered', 'left', 'right'],
    },
    headingSize: {
      description: 'Size variant for the main heading',
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    minHeight: {
      description: 'Minimum height of the Hero section in pixels',
      control: 'number',
    },
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// BASIC STORIES
// ============================================================================

/**
 * Default hero with solid background colour and centered layout.
 * Shows the simplest configuration with title, subtitle, and description.
 */
export const Default: Story = {
  args: {
    title: 'Welcome to Our Platform',
    subtitle: 'Build something amazing',
    description:
      'Create exceptional digital experiences with our comprehensive toolkit.',
    backgroundType: 'colour',
    backgroundColour: 'bg-slate-900',
    layout: 'centered',
    buttons: [
      {
        label: 'Get Started',
        variant: 'primary',
        onClick: () => console.log('Get Started clicked'),
      },
      {
        label: 'Learn More',
        variant: 'outline',
        onClick: () => console.log('Learn More clicked'),
      },
    ],
  },
};

/**
 * Hero with title and CTA button only.
 * Demonstrates a minimal, clean configuration.
 */
export const Minimal: Story = {
  args: {
    title: 'Simple Hero',
    backgroundType: 'colour',
    backgroundColour: 'bg-indigo-600',
    layout: 'centered',
    minHeight: 300,
    buttons: [
      {
        label: 'Start Now',
        variant: 'primary',
      },
    ],
  },
};

// ============================================================================
// LAYOUT VARIANTS
// ============================================================================

/**
 * Hero with centered layout.
 * Content and buttons are centred horizontally and vertically.
 * Best for hero sections that need to capture attention.
 */
export const CentredLayout: Story = {
  args: {
    title: 'Centred Content',
    subtitle: 'Perfectly balanced',
    description:
      'This layout places content in the centre of the viewport, ideal for attention-grabbing hero sections.',
    backgroundType: 'colour',
    backgroundColour: 'bg-blue-600',
    layout: 'centered',
    buttons: [
      { label: 'Explore', variant: 'primary' },
      { label: 'Discover', variant: 'secondary' },
    ],
  },
};

/**
 * Hero with left-aligned layout.
 * Content is aligned to the left side of the Hero.
 * Useful for landing pages with asymmetric designs.
 */
export const LeftAlignedLayout: Story = {
  args: {
    title: 'Left-Aligned Content',
    subtitle: 'Positioned to the side',
    description:
      'This layout aligns content to the left, creating an asymmetric design often used in modern landing pages.',
    backgroundType: 'colour',
    backgroundColour: 'bg-green-600',
    layout: 'left',
    textAlign: 'left',
    buttons: [
      { label: 'Get Started', variant: 'primary' },
      { label: 'More Info', variant: 'outline' },
    ],
  },
};

/**
 * Hero with right-aligned layout.
 * Content is aligned to the right side of the Hero.
 * Creates visual interest by breaking symmetry.
 */
export const RightAlignedLayout: Story = {
  args: {
    title: 'Right-Aligned Content',
    subtitle: 'Positioned opposite',
    description:
      'This layout aligns content to the right, creating visual hierarchy and balance with imagery on the left.',
    backgroundType: 'colour',
    backgroundColour: 'bg-purple-600',
    layout: 'right',
    textAlign: 'right',
    buttons: [
      { label: 'Begin', variant: 'primary' },
      { label: 'Learn', variant: 'secondary' },
    ],
  },
};

// ============================================================================
// BACKGROUND TYPE STORIES
// ============================================================================

/**
 * Hero with solid colour background.
 * Simple, performant background using a single colour.
 * Great for branding and quick implementations.
 */
export const SolidColourBackground: Story = {
  args: {
    title: 'Solid Colour Background',
    subtitle: 'Simple and effective',
    description: 'Clean, solid backgrounds are perfect for focused messaging.',
    backgroundType: 'colour',
    backgroundColour: 'bg-red-600',
    layout: 'centered',
    buttons: [
      { label: 'Discover', variant: 'primary' },
      { label: 'Details', variant: 'outline' },
    ],
  },
};

/**
 * Hero with gradient background.
 * Multi-coloured gradient creates depth and visual interest.
 * Supports multiple directions for creative layouts.
 */
export const GradientBackground: Story = {
  args: {
    title: 'Gradient Background',
    subtitle: 'Smooth colour transitions',
    description:
      'Gradient backgrounds add visual depth and create modern, engaging designs.',
    backgroundType: 'gradient',
    gradient: {
      direction: 'to-bottom-right',
      from: '#667eea',
      to: '#764ba2',
    },
    overlay: { colour: 'rgba(0, 0, 0, 0)', opacity: 0 },
    layout: 'centered',
    buttons: [
      { label: 'Start', variant: 'primary' },
      { label: 'Explore', variant: 'secondary' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a purple gradient background transitioning diagonally. No overlay applied to show full gradient vibrancy.',
      },
    },
  },
};

/**
 * Hero with image background.
 * Full-width background image with overlay for text contrast.
 * Note: In Storybook, uses a placeholder. Replace with actual image URLs in production.
 */
export const ImageBackground: Story = {
  args: {
    title: 'Image Background',
    subtitle: 'Visual storytelling',
    description:
      'Background images create immersive experiences. Text is overlaid for readability.',
    backgroundType: 'image',
    backgroundImage:
      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600&q=80',
    backgroundImageAlt: 'Team collaboration in an office setting',
    overlay: { colour: 'rgba(0, 0, 0, 0.5)', opacity: 0.5 },
    layout: 'centered',
    buttons: [
      { label: 'Join Us', variant: 'primary' },
      { label: 'Learn More', variant: 'outline' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Background image from Unsplash with semi-transparent dark overlay to ensure text readability.',
      },
    },
  },
};

/**
 * Hero with video background.
 * Looping video background with poster image fallback.
 * Creates dynamic, engaging hero sections.
 */
export const VideoBackground: Story = {
  args: {
    title: 'Video Background',
    subtitle: 'Dynamic and engaging',
    description:
      'Videos create immersive, dynamic hero sections that capture attention.',
    backgroundType: 'video',
    backgroundVideo:
      'https://file-examples.com/storage/fe2cf7c3eb6a4cb819843f7/2017/04/file_example_MP4_1920_18MG.mp4',
    overlay: { colour: 'rgba(0, 0, 0, 0.4)', opacity: 0.4 },
    layout: 'centered',
    buttons: [
      { label: 'Watch Now', variant: 'primary' },
      { label: 'More Info', variant: 'outline' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Video background with poster image fallback. Video autoplays, loops, and is muted for optimal user experience.',
      },
    },
  },
};

// ============================================================================
// OVERLAY STORIES
// ============================================================================

/**
 * Hero with minimal overlay (low opacity).
 * Allows background to show through with better visibility.
 * Useful for vibrant backgrounds that don't need much darkening.
 */
export const LightOverlay: Story = {
  args: {
    title: 'Light Overlay',
    subtitle: 'Subtle darkness',
    description:
      'A light overlay allows the background to remain prominent while ensuring text readability.',
    backgroundType: 'gradient',
    gradient: {
      direction: 'to-right',
      from: '#f093fb',
      to: '#f5576c',
    },
    overlay: { colour: 'rgba(0, 0, 0, 0.2)', opacity: 0.2 },
    layout: 'centered',
    buttons: [{ label: 'Let\'s Go', variant: 'primary' }],
  },
};

/**
 * Hero with heavy overlay (high opacity).
 * Darkens the background significantly for maximum text contrast.
 * Ideal for complex or busy backgrounds.
 */
export const HeavyOverlay: Story = {
  args: {
    title: 'Heavy Overlay',
    subtitle: 'Maximum contrast',
    description:
      'A heavy overlay darkens the background significantly, ensuring maximum text readability.',
    backgroundType: 'image',
    backgroundImage:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80',
    backgroundImageAlt: 'People collaborating in modern workspace',
    overlay: { colour: 'rgba(0, 0, 0, 0.7)', opacity: 0.7 },
    layout: 'centered',
    buttons: [
      { label: 'Start', variant: 'primary' },
      { label: 'Learn', variant: 'outline' },
    ],
  },
};

// ============================================================================
// HEADING SIZE STORIES
// ============================================================================

/**
 * Hero with small heading size.
 * Compact heading useful for secondary hero sections or landing pages.
 */
export const SmallHeading: Story = {
  args: {
    title: 'Compact Hero',
    subtitle: 'Smaller heading size',
    description: 'This uses a smaller heading size for secondary hero sections.',
    backgroundType: 'colour',
    backgroundColour: 'bg-orange-600',
    layout: 'centered',
    headingSize: 'small',
    buttons: [{ label: 'Action', variant: 'primary' }],
  },
};

/**
 * Hero with medium heading size.
 * Balanced heading size for typical hero sections.
 */
export const MediumHeading: Story = {
  args: {
    title: 'Balanced Hero',
    subtitle: 'Medium heading size',
    description:
      'Medium heading provides a balanced, professional appearance.',
    backgroundType: 'colour',
    backgroundColour: 'bg-cyan-600',
    layout: 'centered',
    headingSize: 'medium',
    buttons: [
      { label: 'Get Started', variant: 'primary' },
      { label: 'Learn More', variant: 'secondary' },
    ],
  },
};

/**
 * Hero with large heading size.
 * Bold, attention-grabbing heading for primary hero sections.
 */
export const LargeHeading: Story = {
  args: {
    title: 'Large Hero',
    subtitle: 'Maximum impact',
    description: 'Large heading creates maximum visual impact and captures attention.',
    backgroundType: 'colour',
    backgroundColour: 'bg-rose-600',
    layout: 'centered',
    headingSize: 'large',
    minHeight: 500,
    buttons: [
      { label: 'Explore', variant: 'primary' },
      { label: 'Discover', variant: 'secondary' },
      { label: 'Learn', variant: 'outline' },
    ],
  },
};

// ============================================================================
// BUTTON VARIANT STORIES
// ============================================================================

/**
 * Hero with all button variants.
 * Demonstrates primary, secondary, and outline button styles.
 */
export const AllButtonVariants: Story = {
  args: {
    title: 'Button Variations',
    subtitle: 'Multiple CTA styles',
    description:
      'Hero sections can feature multiple button variants to guide users through different actions.',
    backgroundType: 'colour',
    backgroundColour: 'bg-slate-800',
    layout: 'centered',
    buttons: [
      {
        label: 'Primary Action',
        variant: 'primary',
        onClick: () => console.log('Primary clicked'),
      },
      {
        label: 'Secondary Action',
        variant: 'secondary',
        onClick: () => console.log('Secondary clicked'),
      },
      {
        label: 'Learn More',
        variant: 'outline',
        onClick: () => console.log('Outline clicked'),
      },
    ],
  },
};

/**
 * Hero with disabled button.
 * Shows the disabled state for user guidance.
 */
export const DisabledButton: Story = {
  args: {
    title: 'Coming Soon',
    subtitle: 'This feature is not yet available',
    description:
      'Buttons can be disabled to indicate features that are unavailable.',
    backgroundType: 'colour',
    backgroundColour: 'bg-slate-600',
    layout: 'centered',
    buttons: [
      {
        label: 'Sign Up',
        variant: 'primary',
        disabled: true,
        onClick: () => console.log('Disabled clicked'),
      },
      {
        label: 'Contact Sales',
        variant: 'secondary',
        onClick: () => console.log('Sales clicked'),
      },
    ],
  },
};

// ============================================================================
// ACCESSIBILITY STORIES
// ============================================================================

/**
 * Hero optimised for keyboard navigation.
 * Demonstrates proper focus management and keyboard accessibility.
 * Press Tab to navigate through interactive elements.
 */
export const KeyboardAccessible: Story = {
  args: {
    title: 'Keyboard Navigation Optimised',
    subtitle: 'Fully keyboard accessible',
    description:
      'All interactive elements are reachable and operable via keyboard. Press Tab to navigate.',
    backgroundType: 'colour',
    backgroundColour: 'bg-indigo-700',
    layout: 'centered',
    buttons: [
      {
        label: 'Primary Action (Tab 1)',
        variant: 'primary',
        ariaLabel: 'Press Enter to submit primary action',
      },
      {
        label: 'Secondary Action (Tab 2)',
        variant: 'secondary',
        ariaLabel: 'Press Enter to submit secondary action',
      },
      {
        label: 'Tertiary Action (Tab 3)',
        variant: 'outline',
        ariaLabel: 'Press Enter to submit tertiary action',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'All buttons are keyboard accessible with visible focus indicators. ARIA labels provide context for screen readers. Press Tab to navigate through buttons.',
      },
    },
  },
};

/**
 * Hero optimised for screen reader users.
 * Demonstrates semantic HTML and ARIA labelling.
 */
export const ScreenReaderOptimised: Story = {
  args: {
    title: 'Digital Innovation Platform',
    titleAriaLabel: 'Main: Digital Innovation Platform hero section',
    subtitle: 'Transform Your Business with Cutting-Edge Solutions',
    description:
      'Our comprehensive toolkit empowers teams to build exceptional digital experiences. With powerful features and intuitive interfaces, you can ship products faster and delight your users.',
    backgroundType: 'gradient',
    gradient: {
      direction: 'to-bottom',
      from: '#667eea',
      to: '#764ba2',
    },
    layout: 'centered',
    ariaLabel: 'Main hero section with call-to-action buttons',
    buttons: [
      {
        label: 'Start Free Trial',
        variant: 'primary',
        ariaLabel:
          'Start your free trial today - no credit card required, 14 days of full access',
      },
      {
        label: 'Request Demo',
        variant: 'secondary',
        ariaLabel: 'Request a personalized demo from our sales team',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Optimised for screen reader users with semantic HTML (section, h1, p), ARIA labels for context, and descriptive button labels.',
      },
    },
  },
};

/**
 * Hero with high contrast for accessibility.
 * Uses maximum contrast ratio for maximum readability (WCAG AAA).
 */
export const HighContrast: Story = {
  args: {
    title: 'High Contrast Design',
    subtitle: 'WCAG AAA Accessibility Compliant',
    description:
      'White text on black background provides maximum contrast ratio (21:1), exceeding WCAG AAA standards.',
    backgroundType: 'colour',
    backgroundColour: 'bg-black',
    overlay: { colour: 'rgba(0, 0, 0, 0)', opacity: 0 },
    layout: 'centered',
    buttons: [
      {
        label: 'High Contrast Primary',
        variant: 'primary',
        ariaLabel: 'Primary action with high contrast',
      },
      {
        label: 'High Contrast Outline',
        variant: 'outline',
        ariaLabel: 'Outline action with high contrast',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pure black background with white text and buttons achieves maximum colour contrast (21:1 ratio), exceeding WCAG AAA standards.',
      },
    },
  },
};

// ============================================================================
// INTERACTIVE STORIES
// ============================================================================

/**
 * Interactive hero with working buttons.
 * Demonstrates button click handling and interactions.
 */
export const Interactive: Story = {
  args: {
    title: 'Try Clicking the Buttons',
    subtitle: 'Interactive Example',
    description:
      'Click the buttons below to see interactions. Check the Actions panel in Storybook.',
    backgroundType: 'colour',
    backgroundColour: 'bg-teal-600',
    layout: 'centered',
    buttons: [
      {
        label: 'Click Me!',
        variant: 'primary',
        onClick: () => alert('Primary button clicked!'),
      },
      {
        label: 'Or Me!',
        variant: 'secondary',
        onClick: () => alert('Secondary button clicked!'),
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive example demonstrating button click handlers. See the Actions panel to view click events.',
      },
    },
  },
};

// ============================================================================
// MOBILE RESPONSIVE STORIES
// ============================================================================

/**
 * Hero responsive on mobile devices.
 * Demonstrates mobile-first responsive design.
 * Resize viewport to see responsive behaviour.
 */
export const MobileResponsive: Story = {
  args: {
    title: 'Mobile Responsive Design',
    subtitle: 'Works on any device',
    description:
      'This hero adapts beautifully to mobile, tablet, and desktop screens. Resize your viewport to see responsiveness.',
    backgroundType: 'image',
    backgroundImage:
      'https://images.unsplash.com/photo-1512941691920-25a193f57fdd?w=1600&q=80',
    backgroundImageAlt: 'Mobile phone showing responsive design',
    overlay: { colour: 'rgba(0, 0, 0, 0.4)', opacity: 0.4 },
    layout: 'centered',
    minHeight: 400,
    buttons: [
      {
        label: 'Mobile Friendly',
        variant: 'primary',
      },
      {
        label: 'Responsive',
        variant: 'outline',
      },
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Hero component designed mobile-first. Text sizes scale appropriately for different screen sizes. Try viewing in different viewport sizes.',
      },
    },
  },
};

/**
 * Hero on tablet viewport.
 * Shows optimised tablet experience.
 */
export const TabletView: Story = {
  ...MobileResponsive,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Hero optimised for tablet viewing experience.',
      },
    },
  },
};

/**
 * Hero on desktop viewport.
 * Full desktop experience with maximum space.
 */
export const DesktopView: Story = {
  ...MobileResponsive,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Hero optimised for desktop viewing experience.',
      },
    },
  },
};
