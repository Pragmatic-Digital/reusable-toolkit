import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import axe from 'axe-core';
import { FeatureGrid, FeatureCard } from './FeatureGrid';
import type { Feature } from './FeatureGrid';

const IMAGE_SRC = 'https://cdn.example.com/icon.png';

/**
 * Runs axe against a rendered subtree. `color-contrast` is off (jsdom does not
 * paint) and `preload` is off (jsdom never resolves the asset requests, so the
 * run would hang). Contrast is verified via the Storybook a11y addon.
 */
const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

const SvgIcon = () => (
  <svg data-testid="svg-glyph" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" />
  </svg>
);

const iconFeatures: Feature[] = [
  { icon: <SvgIcon />, title: 'Fast', description: 'Very fast.' },
  { icon: <SvgIcon />, title: 'Secure', description: 'Very secure.' },
  { icon: <SvgIcon />, title: 'Loved', description: 'Very loved.' },
];

describe('FeatureGrid Component', () => {
  // =========================================================================
  // Defaults / rendering count
  // =========================================================================

  describe('Rendering', () => {
    it('should render with a features array and no other props', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.getByTestId('feature-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('feature-card')).toHaveLength(3);
    });

    it('should render one card per feature', () => {
      render(<FeatureGrid features={iconFeatures.slice(0, 2)} />);
      expect(screen.getAllByTestId('feature-card')).toHaveLength(2);
    });

    it('should render as a list with the correct number of list items', () => {
      render(<FeatureGrid features={iconFeatures} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
      expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    });

    it('should render each feature title as a heading at the default level 3', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
      expect(screen.getByRole('heading', { level: 3, name: 'Fast' })).toBeInTheDocument();
    });

    it('should render descriptions when provided', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.getByText('Very fast.')).toBeInTheDocument();
    });

    it('should apply a custom heading level to every feature', () => {
      render(<FeatureGrid features={iconFeatures} headingLevel={4} />);
      expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(3);
    });

    it('should apply an accessible label to the list', () => {
      render(<FeatureGrid features={iconFeatures} ariaLabel="Product features" />);
      expect(screen.getByRole('list', { name: 'Product features' })).toBeInTheDocument();
    });

    it('should apply a custom className to the grid', () => {
      render(<FeatureGrid features={iconFeatures} className="custom-class" />);
      expect(screen.getByTestId('feature-grid')).toHaveClass('custom-class');
    });

    it('should forward a ref to the list element', () => {
      const ref = { current: null as HTMLUListElement | null };
      render(<FeatureGrid features={iconFeatures} ref={ref} />);
      expect(ref.current?.tagName).toBe('UL');
    });
  });

  // =========================================================================
  // Columns
  // =========================================================================

  describe('Columns', () => {
    it('should default to 3 columns', () => {
      render(<FeatureGrid features={iconFeatures} />);
      const grid = screen.getByTestId('feature-grid');
      expect(grid).toHaveAttribute('data-columns', '3');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('should apply a 2-column layout', () => {
      render(<FeatureGrid features={iconFeatures} columns={2} />);
      const grid = screen.getByTestId('feature-grid');
      expect(grid).toHaveAttribute('data-columns', '2');
      expect(grid).toHaveClass('sm:grid-cols-2');
    });

    it('should apply a 4-column layout', () => {
      render(<FeatureGrid features={iconFeatures} columns={4} />);
      const grid = screen.getByTestId('feature-grid');
      expect(grid).toHaveAttribute('data-columns', '4');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('should always collapse to a single column on the smallest screens', () => {
      render(<FeatureGrid features={iconFeatures} columns={4} />);
      expect(screen.getByTestId('feature-grid')).toHaveClass('grid-cols-1');
    });
  });

  // =========================================================================
  // Layout variants
  // =========================================================================

  describe('Layout variants', () => {
    it('should default to the stacked layout', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.getByTestId('feature-grid')).toHaveAttribute('data-layout', 'stacked');
      expect(screen.getAllByTestId('feature-card')[0]).toHaveAttribute('data-layout', 'stacked');
      expect(screen.getAllByTestId('feature-card')[0]).toHaveClass('flex-col');
    });

    it('should switch every card to the horizontal layout', () => {
      render(<FeatureGrid features={iconFeatures} layout="horizontal" />);
      expect(screen.getByTestId('feature-grid')).toHaveAttribute('data-layout', 'horizontal');
      const cards = screen.getAllByTestId('feature-card');
      cards.forEach((card) => {
        expect(card).toHaveAttribute('data-layout', 'horizontal');
        expect(card).toHaveClass('flex-row');
      });
    });
  });

  // =========================================================================
  // Icon vs image
  // =========================================================================

  describe('Icon and image handling', () => {
    it('should render an icon node when icon is provided', () => {
      render(<FeatureGrid features={[{ icon: <SvgIcon />, title: 'Icon feature' }]} />);
      expect(screen.getByTestId('feature-icon')).toBeInTheDocument();
      expect(screen.getByTestId('svg-glyph')).toBeInTheDocument();
      expect(screen.queryByTestId('feature-image')).not.toBeInTheDocument();
    });

    it('should hide a decorative icon from assistive tech', () => {
      render(<FeatureGrid features={[{ icon: <SvgIcon />, title: 'Icon feature' }]} />);
      expect(screen.getByTestId('feature-icon')).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render an image when image is provided', () => {
      render(
        <FeatureGrid
          features={[{ image: IMAGE_SRC, imageAlt: 'A meaningful icon', title: 'Image feature' }]}
        />,
      );
      const image = screen.getByTestId('feature-image');
      expect(image.tagName).toBe('IMG');
      expect(image).toHaveAttribute('src', IMAGE_SRC);
      expect(image).toHaveAttribute('alt', 'A meaningful icon');
      expect(screen.queryByTestId('feature-icon')).not.toBeInTheDocument();
    });

    it('should lazy-load feature images', () => {
      render(<FeatureGrid features={[{ image: IMAGE_SRC, title: 'Image feature' }]} />);
      expect(screen.getByTestId('feature-image')).toHaveAttribute('loading', 'lazy');
    });

    it('should treat an image with no alt as decorative', () => {
      render(<FeatureGrid features={[{ image: IMAGE_SRC, title: 'Image feature' }]} />);
      expect(screen.getByTestId('feature-image')).toHaveAttribute('alt', '');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should prefer the icon when both icon and image are supplied', () => {
      render(
        <FeatureGrid features={[{ icon: <SvgIcon />, image: IMAGE_SRC, title: 'Both' }]} />,
      );
      expect(screen.getByTestId('feature-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('feature-image')).not.toBeInTheDocument();
    });

    it('should render a feature with neither icon nor image', () => {
      render(<FeatureGrid features={[{ title: 'Text only', description: 'No media.' }]} />);
      expect(screen.getByRole('heading', { name: 'Text only' })).toBeInTheDocument();
      expect(screen.queryByTestId('feature-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('feature-image')).not.toBeInTheDocument();
    });

    it('should render icon and image features together in the same grid', () => {
      render(
        <FeatureGrid
          features={[
            { icon: <SvgIcon />, title: 'Icon one' },
            { image: IMAGE_SRC, title: 'Image one' },
          ]}
        />,
      );
      expect(screen.getByTestId('feature-icon')).toBeInTheDocument();
      expect(screen.getByTestId('feature-image')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Badges
  // =========================================================================

  describe('Badges', () => {
    it('should render a badge only on features that provide one', () => {
      render(
        <FeatureGrid
          features={[
            { icon: <SvgIcon />, title: 'Badged', badge: 'New' },
            { icon: <SvgIcon />, title: 'Plain' },
          ]}
        />,
      );
      const badges = screen.getAllByTestId('feature-badge');
      expect(badges).toHaveLength(1);
      expect(badges[0]).toHaveTextContent('New');
    });

    it('should render no badges when none are provided', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.queryAllByTestId('feature-badge')).toHaveLength(0);
    });

    it('should default to the default badge variant', () => {
      render(<FeatureGrid features={[{ title: 'X', badge: 'Tag' }]} />);
      expect(screen.getByTestId('feature-badge')).toHaveAttribute('data-variant', 'default');
    });

    it.each(['default', 'accent', 'muted', 'outline'] as const)(
      'should expose the %s badge variant',
      (variant) => {
        render(<FeatureGrid features={[{ title: 'X', badge: 'Tag', badgeVariant: variant }]} />);
        expect(screen.getByTestId('feature-badge')).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // =========================================================================
  // Linked features
  // =========================================================================

  describe('Linked features', () => {
    it('should render a stretched title link when href is provided', () => {
      render(<FeatureGrid features={[{ title: 'Linked', href: '#go' }]} />);
      const link = screen.getByTestId('feature-title-link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '#go');
      expect(screen.getByRole('link', { name: 'Linked' })).toBeInTheDocument();
    });

    it('should keep a single tab stop per linked card', () => {
      render(<FeatureGrid features={[{ title: 'Linked', description: 'Copy', href: '#go' }]} />);
      expect(screen.getAllByRole('link')).toHaveLength(1);
      expect(screen.getByTestId('feature-card')).toHaveAttribute('data-linked', 'true');
    });

    it('should not render a link for features without href', () => {
      render(<FeatureGrid features={iconFeatures} />);
      expect(screen.queryByTestId('feature-title-link')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('feature-card')[0]).not.toHaveAttribute('data-linked');
    });

    it('should default rel to noopener noreferrer for target _blank', () => {
      render(
        <FeatureGrid
          features={[{ title: 'Linked', href: 'https://example.com', target: '_blank' }]}
        />,
      );
      expect(screen.getByTestId('feature-title-link')).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      );
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================

  describe('Edge cases', () => {
    it('should render an empty grid without breaking', () => {
      render(<FeatureGrid features={[]} />);
      expect(screen.getByTestId('feature-grid')).toBeInTheDocument();
      expect(screen.queryAllByTestId('feature-card')).toHaveLength(0);
    });

    it('should render a single-item features array', () => {
      render(<FeatureGrid features={[iconFeatures[0]]} columns={3} />);
      expect(screen.getAllByTestId('feature-card')).toHaveLength(1);
      // Column classes are still applied; a single item simply fills one cell.
      expect(screen.getByTestId('feature-grid')).toHaveClass('lg:grid-cols-3');
    });

    it('should render an odd number of features in a wider grid', () => {
      const five = [...iconFeatures, ...iconFeatures].slice(0, 5);
      render(<FeatureGrid features={five} columns={4} />);
      expect(screen.getAllByTestId('feature-card')).toHaveLength(5);
    });

    it('should render long headings and descriptions without dropping content', () => {
      const longTitle = 'A very long feature heading '.repeat(4).trim();
      const longDescription = 'A long description sentence. '.repeat(10).trim();
      render(<FeatureGrid features={[{ title: longTitle, description: longDescription }]} />);
      expect(screen.getByRole('heading', { name: longTitle })).toBeInTheDocument();
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });

    it('should render a ReactNode description', () => {
      render(<FeatureGrid features={[{ title: 'X', description: <strong>Bold</strong> }]} />);
      expect(screen.getByText('Bold').tagName).toBe('STRONG');
    });
  });

  // =========================================================================
  // FeatureCard (standalone)
  // =========================================================================

  describe('FeatureCard standalone', () => {
    it('should render on its own outside the grid', () => {
      render(<FeatureCard feature={{ icon: <SvgIcon />, title: 'Solo', description: 'Copy' }} />);
      expect(screen.getByRole('heading', { level: 3, name: 'Solo' })).toBeInTheDocument();
      expect(screen.getByTestId('feature-icon')).toBeInTheDocument();
    });

    it('should honour its own layout and heading level props', () => {
      render(
        <FeatureCard feature={{ title: 'Solo' }} layout="horizontal" headingLevel={2} />,
      );
      expect(screen.getByTestId('feature-card')).toHaveAttribute('data-layout', 'horizontal');
      expect(screen.getByRole('heading', { level: 2, name: 'Solo' })).toBeInTheDocument();
    });

    it('should forward a ref to the article element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<FeatureCard feature={{ title: 'Solo' }} ref={ref} />);
      expect(ref.current?.tagName).toBe('ARTICLE');
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations for an icon-based grid with badges', async () => {
      const { container } = render(
        <FeatureGrid
          ariaLabel="Product features"
          features={[
            { icon: <SvgIcon />, title: 'Fast', description: 'Very fast.', badge: 'New' },
            { icon: <SvgIcon />, title: 'Secure', description: 'Very secure.' },
            { icon: <SvgIcon />, title: 'Loved', description: 'Very loved.' },
          ]}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for an image-based grid', async () => {
      const { container } = render(
        <FeatureGrid
          ariaLabel="Product features"
          features={[
            { image: IMAGE_SRC, imageAlt: 'Analytics dashboard', title: 'Analytics', description: 'Copy.' },
            { image: IMAGE_SRC, imageAlt: '', title: 'Automation', description: 'Copy.' },
          ]}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for linked features', async () => {
      const { container } = render(
        <FeatureGrid
          ariaLabel="Product features"
          features={iconFeatures.map((f, i) => ({ ...f, href: `#feature-${i}` }))}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations in the horizontal layout', async () => {
      const { container } = render(
        <FeatureGrid ariaLabel="Product features" layout="horizontal" features={iconFeatures} />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default 3-column grid', () => {
      const { container } = render(
        <FeatureGrid ariaLabel="Product features" features={iconFeatures} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the 4-column image grid', () => {
      const { container } = render(
        <FeatureGrid
          ariaLabel="Product features"
          columns={4}
          features={[
            { image: IMAGE_SRC, imageAlt: '', title: 'One', description: 'Copy.' },
            { image: IMAGE_SRC, imageAlt: '', title: 'Two', description: 'Copy.' },
          ]}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the horizontal layout with a badge', () => {
      const { container } = render(
        <FeatureGrid
          ariaLabel="Product features"
          columns={2}
          layout="horizontal"
          features={[
            { icon: <SvgIcon />, title: 'Fast', description: 'Copy.', badge: 'New', badgeVariant: 'accent' },
            { icon: <SvgIcon />, title: 'Secure', description: 'Copy.' },
          ]}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
