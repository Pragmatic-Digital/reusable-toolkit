import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import axe from 'axe-core';
import { Card } from './Card';

const IMAGE_SRC = 'https://cdn.example.com/hero.jpg';
const IMAGE_ALT = 'A winding mountain road at dusk';

/**
 * Runs axe against a rendered subtree. `color-contrast` is disabled (jsdom does
 * not paint, so it cannot resolve colours) and `preload` is off (jsdom never
 * resolves the asset requests, so the run would hang). Contrast is verified via
 * the Storybook a11y addon in a real browser.
 */
const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

describe('Card Component', () => {
  // =========================================================================
  // Required Props
  // =========================================================================

  describe('Required props only', () => {
    it('should render with only an image and title', () => {
      render(<Card image={IMAGE_SRC} imageAlt={IMAGE_ALT} title="Card title" />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Card title');
      expect(screen.getByRole('img', { name: IMAGE_ALT })).toBeInTheDocument();
    });

    it('should render as an article element', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.getByTestId('card').tagName).toBe('ARTICLE');
    });

    it('should omit excerpt, badge and footer when only image and title are given', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.queryByTestId('card-excerpt')).not.toBeInTheDocument();
      expect(screen.queryByTestId('card-badge')).not.toBeInTheDocument();
      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    });

    it('should apply a custom className to the root', () => {
      render(<Card image={IMAGE_SRC} title="Card title" className="custom-class" />);
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });

    it('should forward a ref to the article element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Card image={IMAGE_SRC} title="Card title" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('ARTICLE');
    });

    it('should render the title at the requested heading level', () => {
      render(<Card image={IMAGE_SRC} title="Card title" headingLevel={2} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Card title');
    });

    it('should default the heading to level 3', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Image
  // =========================================================================

  describe('Image', () => {
    it('should lazy-load the image by default', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.getByTestId('card-image')).toHaveAttribute('loading', 'lazy');
    });

    it('should allow eager loading', () => {
      render(<Card image={IMAGE_SRC} title="Card title" imageLoading="eager" />);
      expect(screen.getByTestId('card-image')).toHaveAttribute('loading', 'eager');
    });

    it('should apply the provided alt text', () => {
      render(<Card image={IMAGE_SRC} title="Card title" imageAlt={IMAGE_ALT} />);
      expect(screen.getByRole('img', { name: IMAGE_ALT })).toHaveAttribute('src', IMAGE_SRC);
    });

    it('should treat an image with no alt as decorative', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      const image = screen.getByTestId('card-image');
      expect(image).toHaveAttribute('alt', '');
      // An empty alt hides the image from the accessibility tree.
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should apply a custom aspect ratio to the media frame', () => {
      render(<Card image={IMAGE_SRC} title="Card title" imageAspectRatio="1 / 1" />);
      expect(screen.getByTestId('card-media')).toHaveStyle({ aspectRatio: '1 / 1' });
    });
  });

  // =========================================================================
  // No-image fallback
  // =========================================================================

  describe('No image', () => {
    it('should render the placeholder when no image is provided', () => {
      render(<Card title="Card title" />);
      expect(screen.queryByTestId('card-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('card-image-placeholder')).toBeInTheDocument();
    });

    it('should render a custom fallback when provided', () => {
      render(<Card title="Card title" imageFallback={<div>Custom fallback</div>} />);
      expect(screen.getByText('Custom fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('card-image-placeholder')).not.toBeInTheDocument();
    });

    it('should keep the media frame so alignment is preserved', () => {
      render(<Card title="Card title" imageAspectRatio="4 / 3" />);
      expect(screen.getByTestId('card-media')).toHaveStyle({ aspectRatio: '4 / 3' });
    });
  });

  // =========================================================================
  // Excerpt
  // =========================================================================

  describe('Excerpt', () => {
    it('should render the excerpt when provided', () => {
      render(<Card image={IMAGE_SRC} title="Card title" excerpt="Supporting copy." />);
      expect(screen.getByTestId('card-excerpt')).toHaveTextContent('Supporting copy.');
    });

    it('should omit the excerpt when not provided', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.queryByTestId('card-excerpt')).not.toBeInTheDocument();
    });

    it('should clamp the excerpt when excerptLines is set', () => {
      render(
        <Card image={IMAGE_SRC} title="Card title" excerpt="Long copy" excerptLines={3} />,
      );
      expect(screen.getByTestId('card-excerpt')).toHaveStyle({ WebkitLineClamp: '3' });
    });

    it('should not clamp the excerpt by default', () => {
      render(<Card image={IMAGE_SRC} title="Card title" excerpt="Copy" />);
      const excerpt = screen.getByTestId('card-excerpt');
      expect(excerpt.style.webkitLineClamp).toBe('');
    });
  });

  // =========================================================================
  // Badge
  // =========================================================================

  describe('Badge', () => {
    it('should render the badge with its label when provided', () => {
      render(<Card image={IMAGE_SRC} title="Card title" badge="New" />);
      expect(screen.getByTestId('card-badge')).toHaveTextContent('New');
    });

    it('should omit the badge entirely when not provided', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.queryByTestId('card-badge')).not.toBeInTheDocument();
    });

    it('should default to the default badge variant', () => {
      render(<Card image={IMAGE_SRC} title="Card title" badge="Tag" />);
      expect(screen.getByTestId('card-badge')).toHaveAttribute('data-variant', 'default');
    });

    it.each(['default', 'accent', 'muted', 'outline'] as const)(
      'should expose the %s badge variant',
      (variant) => {
        render(<Card image={IMAGE_SRC} title="Card title" badge="Tag" badgeVariant={variant} />);
        expect(screen.getByTestId('card-badge')).toHaveAttribute('data-variant', variant);
      },
    );
  });

  // =========================================================================
  // Footer Action
  // =========================================================================

  describe('Footer action', () => {
    it('should omit the footer when no action is provided', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    });

    it('should default to a link-style action', () => {
      render(
        <Card image={IMAGE_SRC} title="Card title" action={{ label: 'Read more', href: '#post' }} />,
      );
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveAttribute('data-variant', 'link');
      expect(footer.tagName).toBe('A');
      expect(footer).toHaveAttribute('href', '#post');
    });

    it('should render a button-style action as the Button primitive', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'View', href: '#x', variant: 'button' }}
        />,
      );
      const footer = screen.getByTestId('card-footer');
      expect(footer).toHaveAttribute('data-variant', 'button');
      expect(footer.tagName).toBe('A');
      expect(footer).toHaveAttribute('href', '#x');
    });

    it('should render a link-style action with an onClick as a button element', () => {
      const onClick = vi.fn();
      render(
        <Card image={IMAGE_SRC} title="Card title" action={{ label: 'Do it', onClick }} />,
      );
      const footer = screen.getByTestId('card-footer');
      expect(footer.tagName).toBe('BUTTON');
      fireEvent.click(footer);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should render a button-style action with an onClick as a button element', () => {
      const onClick = vi.fn();
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Do it', variant: 'button', onClick }}
        />,
      );
      const footer = screen.getByTestId('card-footer');
      expect(footer.tagName).toBe('BUTTON');
      fireEvent.click(footer);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when an href link action is clicked', () => {
      const onClick = vi.fn();
      render(
        <Card image={IMAGE_SRC} title="Card title" action={{ label: 'Read', href: '#p', onClick }} />,
      );
      fireEvent.click(screen.getByTestId('card-footer'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should default rel to noopener noreferrer for target _blank', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'External', href: 'https://example.com', target: '_blank' }}
        />,
      );
      expect(screen.getByTestId('card-footer')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should respect an explicit rel', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'External', href: 'https://example.com', target: '_blank', rel: 'nofollow' }}
        />,
      );
      expect(screen.getByTestId('card-footer')).toHaveAttribute('rel', 'nofollow');
    });

    it('should use ariaLabel as the accessible name of the action', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Read more', href: '#p', ariaLabel: 'Read more about Card title' }}
        />,
      );
      expect(
        screen.getByRole('link', { name: 'Read more about Card title' }),
      ).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Interactive (whole card clickable)
  // =========================================================================

  describe('Interactive whole card', () => {
    it('should make the title a stretched link to the action href', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Read more', href: '#post' }}
          interactive
        />,
      );
      const titleLink = screen.getByTestId('card-title-link');
      expect(titleLink.tagName).toBe('A');
      expect(titleLink).toHaveAttribute('href', '#post');
      expect(screen.getByTestId('card')).toHaveAttribute('data-interactive', 'true');
    });

    it('should keep a single tab stop by making the footer non-focusable', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Read more', href: '#post' }}
          interactive
        />,
      );
      // Exactly one link overall — the stretched title link. The footer is inert.
      expect(screen.getAllByRole('link')).toHaveLength(1);
      const footer = screen.getByTestId('card-footer');
      expect(footer.tagName).toBe('DIV');
      expect(footer).toHaveAttribute('aria-hidden', 'true');
    });

    it('should give the interactive card an accessible name from the heading', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Read more', href: '#post' }}
          interactive
        />,
      );
      expect(screen.getByRole('link', { name: 'Card title' })).toBeInTheDocument();
    });

    it('should ignore interactive when the action has no href', () => {
      render(
        <Card
          image={IMAGE_SRC}
          title="Card title"
          action={{ label: 'Do it', onClick: vi.fn() }}
          interactive
        />,
      );
      expect(screen.queryByTestId('card-title-link')).not.toBeInTheDocument();
      expect(screen.getByTestId('card')).not.toHaveAttribute('data-interactive');
      // Falls back to a real, focusable footer control.
      expect(screen.getByTestId('card-footer').tagName).toBe('BUTTON');
    });

    it('should ignore interactive when there is no action at all', () => {
      render(<Card image={IMAGE_SRC} title="Card title" interactive />);
      expect(screen.queryByTestId('card-title-link')).not.toBeInTheDocument();
      expect(screen.getByTestId('card')).not.toHaveAttribute('data-interactive');
    });
  });

  // =========================================================================
  // Hover / focus
  // =========================================================================

  describe('Hover effect', () => {
    it('should default to the lift effect', () => {
      render(<Card image={IMAGE_SRC} title="Card title" />);
      expect(screen.getByTestId('card')).toHaveAttribute('data-hover-effect', 'lift');
    });

    it.each(['lift', 'zoom', 'border', 'none'] as const)(
      'should expose the %s hover effect',
      (effect) => {
        render(<Card image={IMAGE_SRC} title="Card title" hoverEffect={effect} />);
        expect(screen.getByTestId('card')).toHaveAttribute('data-hover-effect', effect);
      },
    );

    it('should mirror hover feedback on focus-within so it never hides the focus ring', () => {
      render(<Card image={IMAGE_SRC} title="Card title" hoverEffect="lift" />);
      expect(screen.getByTestId('card').className).toContain('focus-within:shadow-lg');
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations for a default card', async () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          badge="New"
          title="Card title"
          excerpt="Supporting copy."
          action={{ label: 'Read more', href: '#post' }}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for an interactive card', async () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          badge="Case study"
          badgeVariant="accent"
          title="Card title"
          excerpt="Supporting copy."
          action={{ label: 'Read more', href: '#post' }}
          interactive
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for a button-style footer', async () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          title="Card title"
          action={{ label: 'View project', href: '#x', variant: 'button' }}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for a no-image card', async () => {
      const { container } = render(
        <Card title="Card title" excerpt="Copy" action={{ label: 'Read more', href: '#p' }} />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Edge cases
  // =========================================================================

  describe('Edge cases', () => {
    it('should render long title and excerpt without dropping content', () => {
      const longTitle = 'A very long card title '.repeat(6).trim();
      const longExcerpt = 'A very long excerpt sentence. '.repeat(12).trim();
      render(<Card image={IMAGE_SRC} title={longTitle} excerpt={longExcerpt} />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(longTitle);
      expect(screen.getByTestId('card-excerpt')).toHaveTextContent(longExcerpt);
    });

    it('should render a ReactNode excerpt', () => {
      render(
        <Card image={IMAGE_SRC} title="Card title" excerpt={<strong>Bold copy</strong>} />,
      );
      expect(within(screen.getByTestId('card-excerpt')).getByText('Bold copy').tagName).toBe(
        'STRONG',
      );
    });

    it('should render arbitrary children between excerpt and footer', () => {
      render(
        <Card image={IMAGE_SRC} title="Card title" action={{ label: 'Go', href: '#a' }}>
          <span data-testid="extra">Extra content</span>
        </Card>,
      );
      expect(screen.getByTestId('extra')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default variant', () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          title="Card title"
          excerpt="Supporting copy."
          action={{ label: 'Read more', href: '#post' }}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the image-and-title-only variant', () => {
      const { container } = render(<Card image={IMAGE_SRC} imageAlt={IMAGE_ALT} title="Card title" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the badge + button footer variant', () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          badge="New"
          badgeVariant="accent"
          title="Card title"
          excerpt="Supporting copy."
          action={{ label: 'View project', href: '#x', variant: 'button' }}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the interactive variant', () => {
      const { container } = render(
        <Card
          image={IMAGE_SRC}
          imageAlt={IMAGE_ALT}
          title="Card title"
          excerpt="Supporting copy."
          action={{ label: 'Read more', href: '#post' }}
          interactive
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the no-image variant', () => {
      const { container } = render(
        <Card title="Card title" excerpt="Copy" action={{ label: 'Read more', href: '#p' }} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
