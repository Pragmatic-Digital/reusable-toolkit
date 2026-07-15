import type { Meta, StoryObj } from '@storybook/react';
import { LogoGrid } from './LogoGrid';
import type { Logo } from './LogoGrid';

/**
 * Builds an inline SVG data URI at a given aspect ratio, so the stories are
 * self-contained and visibly prove that different shapes render at one height.
 */
const svgLogo = (label: string, w: number, h: number, colour: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" rx="8" fill="${colour}"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="sans-serif" font-size="${Math.min(w, h) / 3}" fill="#fff">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const wide = (label: string, colour: string): Logo => ({
  src: svgLogo(label, 240, 80, colour),
  alt: label,
});
const square = (label: string, colour: string): Logo => ({
  src: svgLogo(label, 100, 100, colour),
  alt: label,
});
const tall = (label: string, colour: string): Logo => ({
  src: svgLogo(label, 80, 120, colour),
  alt: label,
});

const PALETTE = ['#4f46e5', '#0ea5e9', '#059669', '#d97706', '#db2777', '#7c3aed'];

const logos: Logo[] = [
  { ...wide('Acme', PALETTE[0]), href: 'https://example.com/acme' },
  { ...wide('Globex', PALETTE[1]), href: 'https://example.com/globex' },
  { ...wide('Initech', PALETTE[2]), href: 'https://example.com/initech' },
  { ...wide('Umbrella', PALETTE[3]), href: 'https://example.com/umbrella' },
  { ...wide('Soylent', PALETTE[4]), href: 'https://example.com/soylent' },
  { ...wide('Hooli', PALETTE[5]), href: 'https://example.com/hooli' },
];

const manyLogos: Logo[] = Array.from({ length: 24 }, (_, i) => ({
  ...wide(`Co ${i + 1}`, PALETTE[i % PALETTE.length]),
  href: `https://example.com/co-${i + 1}`,
}));

const meta = {
  title: 'Components/LogoGrid',
  component: LogoGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A responsive grid of logos for client listings, partner sections and integration showcases. Every logo renders at a consistent height regardless of its source dimensions, with an optional per-logo link and a configurable hover treatment.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    columns: { description: 'Columns at the largest breakpoint', control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    maxHeight: { description: 'Fixed logo box height (px)', control: { type: 'number', min: 24, max: 120, step: 4 } },
    showLinks: { description: 'Wrap linked logos in anchors', control: 'boolean' },
    hoverEffect: {
      description: 'Hover treatment',
      control: 'inline-radio',
      options: ['grayscale', 'opacity', 'scale', 'none'],
    },
    gap: { description: 'Grid gap', control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    linkTarget: { control: 'inline-radio', options: ['_blank', '_self'] },
  },
} satisfies Meta<typeof LogoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Standard grid: 4 columns, linked, grayscale-to-colour on hover. */
export const Default: Story = {
  args: { logos, ariaLabel: 'Our partners' },
};

/** showLinks=false renders plain images — no anchors, no href="#". */
export const WithoutLinks: Story = {
  args: { logos, showLinks: false, ariaLabel: 'Our partners' },
};

export const FourColumns: Story = {
  args: { logos, columns: 4, ariaLabel: 'Our partners' },
};

export const FiveColumns: Story = {
  args: { logos: manyLogos.slice(0, 10), columns: 5, ariaLabel: 'Our partners' },
};

export const SixColumns: Story = {
  args: { logos: manyLogos.slice(0, 12), columns: 6, ariaLabel: 'Our partners' },
};

/** Wide, square and tall logos side by side — all land on the same height line. */
export const MixedAspectRatios: Story = {
  args: {
    ariaLabel: 'Our partners',
    columns: 4,
    logos: [
      { ...wide('Wide', PALETTE[0]), href: 'https://example.com' },
      { ...square('Sq', PALETTE[1]), href: 'https://example.com' },
      { ...tall('Tall', PALETTE[2]), href: 'https://example.com' },
      { ...wide('Wide 2', PALETTE[3]), href: 'https://example.com' },
    ],
  },
};

/** SVG (vector) logos — the common case, since most client logos ship as SVG. */
export const SvgLogos: Story = {
  args: { logos, columns: 3, ariaLabel: 'Our partners' },
};

/**
 * Raster logos via picsum, to confirm PNG/JPG sources size identically to SVG.
 * (Uses remote images, so it needs a network connection in Storybook.)
 */
export const RasterLogos: Story = {
  args: {
    ariaLabel: 'Our partners',
    columns: 3,
    logos: [
      { src: 'https://picsum.photos/id/237/240/80', alt: 'Raster one', href: 'https://example.com' },
      { src: 'https://picsum.photos/id/238/120/120', alt: 'Raster two', href: 'https://example.com' },
      { src: 'https://picsum.photos/id/239/80/120', alt: 'Raster three', href: 'https://example.com' },
    ],
  },
};

/** Only three logos — should look intentional, not sparse or broken. */
export const FewLogos: Story = {
  args: { logos: logos.slice(0, 3), columns: 4, ariaLabel: 'Our partners' },
};

/** 24 logos, to check wrapping across many rows stays even. */
export const ManyLogos: Story = {
  args: { logos: manyLogos, columns: 6, ariaLabel: 'Our partners' },
};

/** A taller box, for logos that need more vertical presence. */
export const CustomMaxHeight: Story = {
  args: { logos, maxHeight: 88, columns: 4, ariaLabel: 'Our partners' },
};

export const OpacityHover: Story = {
  args: { logos, hoverEffect: 'opacity', ariaLabel: 'Our partners' },
};

export const ScaleHover: Story = {
  args: { logos, hoverEffect: 'scale', ariaLabel: 'Our partners' },
};

/** Effect disabled — logos render in full colour, no hover change. */
export const NoHoverEffect: Story = {
  args: { logos, hoverEffect: 'none', ariaLabel: 'Our partners' },
};

/** Narrow viewport, to confirm the grid collapses to two columns. */
export const Mobile: Story = {
  args: { logos: manyLogos.slice(0, 8), columns: 6, ariaLabel: 'Our partners' },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
