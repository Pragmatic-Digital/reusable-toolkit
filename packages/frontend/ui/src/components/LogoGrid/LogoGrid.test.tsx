import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { LogoGrid } from './LogoGrid';
import type { Logo } from './LogoGrid';

const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

const logos: Logo[] = [
  { src: 'https://cdn.example.com/acme.svg', alt: 'Acme', href: 'https://acme.example' },
  { src: 'https://cdn.example.com/globex.png', alt: 'Globex', href: 'https://globex.example' },
  { src: 'https://cdn.example.com/initech.svg', alt: 'Initech' },
];

describe('LogoGrid Component', () => {
  // =========================================================================
  // Rendering
  // =========================================================================

  describe('Rendering', () => {
    it('should render with only a logos array', () => {
      render(<LogoGrid logos={logos} />);
      expect(screen.getByTestId('logo-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('logo-item')).toHaveLength(3);
    });

    it('should render one image per logo', () => {
      render(<LogoGrid logos={logos} />);
      expect(screen.getAllByTestId('logo-image')).toHaveLength(3);
    });

    it('should render as a list with the correct number of list items', () => {
      render(<LogoGrid logos={logos} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
      expect(list.querySelectorAll('li')).toHaveLength(3);
    });

    it('should apply an accessible label to the grid', () => {
      render(<LogoGrid logos={logos} ariaLabel="Our partners" />);
      expect(screen.getByRole('list', { name: 'Our partners' })).toBeInTheDocument();
    });

    it('should apply a custom className', () => {
      render(<LogoGrid logos={logos} className="custom-class" />);
      expect(screen.getByTestId('logo-grid')).toHaveClass('custom-class');
    });

    it('should forward a ref to the list element', () => {
      const ref = { current: null as HTMLUListElement | null };
      render(<LogoGrid logos={logos} ref={ref} />);
      expect(ref.current?.tagName).toBe('UL');
    });
  });

  // =========================================================================
  // Alt text
  // =========================================================================

  describe('Alt text', () => {
    it('should render the correct alt text per logo', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      expect(screen.getByAltText('Acme')).toBeInTheDocument();
      expect(screen.getByAltText('Globex')).toBeInTheDocument();
      expect(screen.getByAltText('Initech')).toBeInTheDocument();
    });

    it('should point the image at the provided src, including SVG', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      expect(screen.getByAltText('Acme')).toHaveAttribute('src', 'https://cdn.example.com/acme.svg');
    });

    it('should lazy-load logo images', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      expect(screen.getAllByTestId('logo-image')[0]).toHaveAttribute('loading', 'lazy');
    });
  });

  // =========================================================================
  // Columns
  // =========================================================================

  describe('Columns', () => {
    it('should default to 4 columns', () => {
      render(<LogoGrid logos={logos} />);
      const grid = screen.getByTestId('logo-grid');
      expect(grid).toHaveAttribute('data-columns', '4');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it.each([
      [2, 'grid-cols-2'],
      [3, 'sm:grid-cols-3'],
      [5, 'lg:grid-cols-5'],
      [6, 'lg:grid-cols-6'],
    ] as const)('should apply the %s-column layout', (columns, expectedClass) => {
      render(<LogoGrid logos={logos} columns={columns} />);
      const grid = screen.getByTestId('logo-grid');
      expect(grid).toHaveAttribute('data-columns', String(columns));
      expect(grid).toHaveClass(expectedClass);
    });

    it('should always start at 2 columns on the smallest screens', () => {
      render(<LogoGrid logos={logos} columns={6} />);
      expect(screen.getByTestId('logo-grid')).toHaveClass('grid-cols-2');
    });
  });

  // =========================================================================
  // Links
  // =========================================================================

  describe('Links', () => {
    it('should wrap a logo with a link in an anchor when showLinks is true', () => {
      render(<LogoGrid logos={logos} showLinks />);
      const link = screen.getByRole('link', { name: /Acme/ });
      expect(link).toHaveAttribute('href', 'https://acme.example');
    });

    it('should render only the logos that have an href as links', () => {
      render(<LogoGrid logos={logos} showLinks />);
      // Acme and Globex have hrefs; Initech does not.
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });

    it('should render a logo without an href as a plain image, even when showLinks is true', () => {
      render(<LogoGrid logos={logos} showLinks />);
      const initech = screen.getByAltText('Initech');
      expect(initech.closest('a')).toBeNull();
    });

    it('should render no links at all when showLinks is false', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
      expect(screen.queryByTestId('logo-link')).not.toBeInTheDocument();
    });

    it('should open links in a new tab with a safe rel by default', () => {
      render(<LogoGrid logos={logos} showLinks />);
      const link = screen.getByRole('link', { name: /Acme/ });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should signal external navigation to screen readers', () => {
      render(<LogoGrid logos={logos} showLinks />);
      expect(screen.getByRole('link', { name: /Acme.*opens in a new tab/i })).toBeInTheDocument();
    });

    it('should not set target or rel when linkTarget is _self', () => {
      render(<LogoGrid logos={logos} showLinks linkTarget="_self" />);
      const link = screen.getByRole('link', { name: /Acme/ });
      expect(link).toHaveAttribute('target', '_self');
      expect(link).not.toHaveAttribute('rel');
    });

    it('should not append the new-tab hint when linkTarget is _self', () => {
      render(<LogoGrid logos={logos} showLinks linkTarget="_self" />);
      expect(screen.getByRole('link', { name: 'Acme' })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Sizing / maxHeight
  // =========================================================================

  describe('Consistent sizing', () => {
    it('should default the logo box height to 48px', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      expect(screen.getAllByTestId('logo-item')[0]).toHaveStyle({ height: '48px' });
    });

    it('should apply a custom maxHeight to the box and image', () => {
      render(<LogoGrid logos={logos} showLinks={false} maxHeight={80} />);
      expect(screen.getAllByTestId('logo-item')[0]).toHaveStyle({ height: '80px' });
      expect(screen.getAllByTestId('logo-image')[0]).toHaveStyle({ maxHeight: '80px' });
    });

    it('should constrain every image with object-contain so nothing is distorted', () => {
      render(<LogoGrid logos={logos} showLinks={false} />);
      screen.getAllByTestId('logo-image').forEach((img) => {
        expect(img).toHaveClass('object-contain', 'max-h-full');
      });
    });

    it('should apply a per-logo width override when provided', () => {
      render(<LogoGrid logos={[{ src: 'x.svg', alt: 'Wide', width: 200 }]} showLinks={false} />);
      expect(screen.getByTestId('logo-image')).toHaveStyle({ width: '200px' });
    });
  });

  // =========================================================================
  // Hover effect
  // =========================================================================

  describe('Hover effect', () => {
    it('should default to the grayscale effect', () => {
      render(<LogoGrid logos={logos} />);
      expect(screen.getByTestId('logo-grid')).toHaveAttribute('data-hover-effect', 'grayscale');
      expect(screen.getAllByTestId('logo-image')[0]).toHaveClass('grayscale', 'hover:grayscale-0');
    });

    it.each(['grayscale', 'opacity', 'scale', 'none'] as const)(
      'should expose the %s hover effect',
      (effect) => {
        render(<LogoGrid logos={logos} hoverEffect={effect} />);
        expect(screen.getByTestId('logo-grid')).toHaveAttribute('data-hover-effect', effect);
      },
    );

    it('should apply no effect classes when set to none', () => {
      render(<LogoGrid logos={logos} hoverEffect="none" />);
      const img = screen.getAllByTestId('logo-image')[0];
      expect(img).not.toHaveClass('grayscale');
      expect(img.className).not.toMatch(/hover:/);
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================

  describe('Edge cases', () => {
    it('should render nothing for an empty logos array', () => {
      const { container } = render(<LogoGrid logos={[]} />);
      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('logo-grid')).not.toBeInTheDocument();
    });

    it('should render a single logo without breaking', () => {
      render(<LogoGrid logos={[logos[0]]} />);
      expect(screen.getAllByTestId('logo-item')).toHaveLength(1);
    });

    it('should render a large number of logos', () => {
      const many = Array.from({ length: 24 }, (_, i) => ({ src: `logo-${i}.svg`, alt: `Logo ${i}` }));
      render(<LogoGrid logos={many} columns={6} showLinks={false} />);
      expect(screen.getAllByTestId('logo-item')).toHaveLength(24);
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations for a linked grid', async () => {
      const { container } = render(<LogoGrid logos={logos} ariaLabel="Our partners" />);
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for a link-free grid', async () => {
      const { container } = render(
        <LogoGrid logos={logos} showLinks={false} ariaLabel="Our partners" />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default linked grid', () => {
      const { container } = render(<LogoGrid logos={logos} ariaLabel="Our partners" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for a link-free grid', () => {
      const { container } = render(
        <LogoGrid logos={logos} showLinks={false} columns={3} ariaLabel="Our partners" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
