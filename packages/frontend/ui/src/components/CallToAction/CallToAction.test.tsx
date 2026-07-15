import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import { CallToAction } from './CallToAction';
import type { CallToActionButton } from './CallToAction';

const IMAGE_SRC = 'https://cdn.example.com/background.jpg';
const VIDEO_SRC = 'https://cdn.example.com/background.mp4';
const POSTER_SRC = 'https://cdn.example.com/poster.jpg';

/**
 * Runs axe against a rendered subtree.
 *
 * `color-contrast` is disabled because jsdom does not lay out or paint, so axe
 * cannot resolve computed colours and would report the rule as incomplete
 * rather than passing. Contrast is verified via the Storybook a11y addon,
 * which runs in a real browser.
 *
 * `preload` is disabled because it makes axe fetch stylesheets and media before
 * it starts; jsdom never resolves those requests, so the run hangs.
 */
const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

/** Repoints matchMedia so `(prefers-reduced-motion: reduce)` matches. */
const mockPrefersReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
};

const twoButtons: CallToActionButton[] = [
  { label: 'Book a call', href: '/contact', variant: 'primary' },
  { label: 'See our work', href: '/work', variant: 'secondary' },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('CallToAction Component', () => {
  // =========================================================================
  // Minimal / Required Props
  // =========================================================================

  describe('Required props only', () => {
    it('should render with only a title', () => {
      render(<CallToAction title="Ready to get started?" />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'Ready to get started?',
      );
    });

    it('should render as a section element named by the title', () => {
      render(<CallToAction title="Ready to get started?" />);
      const section = screen.getByRole('region', { name: 'Ready to get started?' });
      expect(section.tagName).toBe('SECTION');
    });

    it('should not render a description, buttons or overlay when only a title is given', () => {
      render(<CallToAction title="Title only" />);
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
      expect(screen.queryAllByRole('button')).toHaveLength(0);
      expect(screen.queryAllByRole('link')).toHaveLength(0);
      expect(screen.queryByTestId('cta-overlay')).not.toBeInTheDocument();
      expect(screen.getByTestId('cta-content').textContent).toBe('Title only');
    });

    it('should prefer an explicit ariaLabel over the title', () => {
      render(<CallToAction title="Title" ariaLabel="Newsletter signup" />);
      expect(screen.getByRole('region', { name: 'Newsletter signup' })).toBeInTheDocument();
    });

    it('should apply a custom className to the section', () => {
      render(<CallToAction title="Title" className="custom-class" />);
      expect(screen.getByRole('region')).toHaveClass('custom-class');
    });

    it('should forward a ref to the section element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<CallToAction title="Title" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('SECTION');
    });
  });

  // =========================================================================
  // Optional Content
  // =========================================================================

  describe('Optional content', () => {
    it('should render the description when provided', () => {
      render(<CallToAction title="Title" description="Supporting copy." />);
      expect(screen.getByText('Supporting copy.')).toBeInTheDocument();
    });

    it('should omit the description when not provided', () => {
      render(<CallToAction title="Title" />);
      expect(screen.getByTestId('cta-content').querySelectorAll('p')).toHaveLength(0);
    });

    it('should render the eyebrow when provided', () => {
      render(<CallToAction title="Title" eyebrow="Working together" />);
      expect(screen.getByText('Working together')).toBeInTheDocument();
    });

    it('should render children in place of the default content', () => {
      render(
        <CallToAction title="Title" description="Should not appear">
          <p>Custom content</p>
        </CallToAction>,
      );
      expect(screen.getByText('Custom content')).toBeInTheDocument();
      expect(screen.queryByText('Should not appear')).not.toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('should render the title at the requested heading level', () => {
      render(<CallToAction title="Title" headingLevel={3} />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title');
    });

    it('should default the heading to level 2', () => {
      render(<CallToAction title="Title" />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should apply minHeight and contentMaxWidth when provided', () => {
      render(<CallToAction title="Title" minHeight="32rem" contentMaxWidth="20rem" />);
      expect(screen.getByRole('region')).toHaveStyle({ minHeight: '32rem' });
      expect(screen.getByTestId('cta-content')).toHaveStyle({ maxWidth: '20rem' });
    });
  });

  // =========================================================================
  // Buttons
  // =========================================================================

  describe('Buttons', () => {
    it('should omit the button group when no buttons are provided', () => {
      render(<CallToAction title="Title" />);
      expect(screen.queryByTestId('cta-buttons')).not.toBeInTheDocument();
    });

    it('should omit the button group when an empty array is provided', () => {
      render(<CallToAction title="Title" buttons={[]} />);
      expect(screen.queryByTestId('cta-buttons')).not.toBeInTheDocument();
    });

    it('should render one button', () => {
      render(<CallToAction title="Title" buttons={[{ label: 'Only' }]} />);
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('should render the correct number of buttons', () => {
      render(<CallToAction title="Title" buttons={twoButtons} />);
      expect(screen.getAllByRole('link')).toHaveLength(2);
    });

    it('should render the correct label and href per button', () => {
      render(<CallToAction title="Title" buttons={twoButtons} />);
      expect(screen.getByRole('link', { name: 'Book a call' })).toHaveAttribute(
        'href',
        '/contact',
      );
      expect(screen.getByRole('link', { name: 'See our work' })).toHaveAttribute(
        'href',
        '/work',
      );
    });

    it('should render the correct variant per button', () => {
      render(<CallToAction title="Title" buttons={twoButtons} />);
      expect(screen.getByRole('link', { name: 'Book a call' })).toHaveAttribute(
        'data-variant',
        'primary',
      );
      expect(screen.getByRole('link', { name: 'See our work' })).toHaveAttribute(
        'data-variant',
        'secondary',
      );
    });

    it('should default the first button to primary and the rest to outline', () => {
      render(
        <CallToAction title="Title" buttons={[{ label: 'First' }, { label: 'Second' }]} />,
      );
      expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute(
        'data-variant',
        'primary',
      );
      expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute(
        'data-variant',
        'outline',
      );
    });

    it('should render an anchor when href is set and a button when it is not', () => {
      render(
        <CallToAction
          title="Title"
          buttons={[{ label: 'Link', href: '/somewhere' }, { label: 'Action' }]}
        />,
      );
      expect(screen.getByRole('link', { name: 'Link' }).tagName).toBe('A');
      expect(screen.getByRole('button', { name: 'Action' }).tagName).toBe('BUTTON');
    });

    it('should call onClick when a button is clicked', () => {
      const handleClick = vi.fn();
      render(<CallToAction title="Title" buttons={[{ label: 'Click me', onClick: handleClick }]} />);
      fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should disable a button when disabled is set', () => {
      render(<CallToAction title="Title" buttons={[{ label: 'Nope', disabled: true }]} />);
      expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled();
    });

    it('should default rel to noopener noreferrer for target _blank', () => {
      render(
        <CallToAction
          title="Title"
          buttons={[{ label: 'External', href: 'https://example.com', target: '_blank' }]}
        />,
      );
      expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
        'rel',
        'noopener noreferrer',
      );
    });

    it('should respect an explicit rel', () => {
      render(
        <CallToAction
          title="Title"
          buttons={[
            { label: 'External', href: 'https://example.com', target: '_blank', rel: 'nofollow' },
          ]}
        />,
      );
      expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('rel', 'nofollow');
    });

    it('should not set rel when there is no target', () => {
      render(<CallToAction title="Title" buttons={[{ label: 'Internal', href: '/x' }]} />);
      expect(screen.getByRole('link', { name: 'Internal' })).not.toHaveAttribute('rel');
    });

    it('should use ariaLabel as the accessible name', () => {
      render(
        <CallToAction title="Title" buttons={[{ label: 'Read more', ariaLabel: 'Read more about us' }]} />,
      );
      expect(screen.getByRole('button', { name: 'Read more about us' })).toBeInTheDocument();
    });

    it('should expose the button group with an accessible name', () => {
      render(<CallToAction title="Title" buttons={twoButtons} />);
      expect(screen.getByRole('group', { name: /call to action buttons/i })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Backgrounds
  // =========================================================================

  describe('Background types', () => {
    it('should default to a solid colour background with no media', () => {
      render(<CallToAction title="Title" />);
      expect(screen.getByRole('region')).toHaveAttribute('data-background-type', 'colour');
      expect(screen.queryByTestId('cta-background-image')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cta-background-video')).not.toBeInTheDocument();
    });

    it('should apply a solid colour to the section', () => {
      render(<CallToAction title="Title" background={{ type: 'colour', colour: '#0f172a' }} />);
      expect(screen.getByRole('region')).toHaveStyle({ backgroundColor: '#0f172a' });
    });

    it('should apply a gradient to the section', () => {
      const gradient = 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)';
      render(<CallToAction title="Title" background={{ type: 'gradient', gradient }} />);
      const section = screen.getByRole('region');
      expect(section).toHaveAttribute('data-background-type', 'gradient');
      // jsdom re-serialises colour stops to rgb(), so match on structure rather
      // than on the literal string that was passed in.
      expect(section.style.backgroundImage).toMatch(/^linear-gradient\(135deg,/);
      expect(section.style.backgroundImage).toContain('rgb(79, 70, 229)');
    });

    it('should render an image and no video for an image background', () => {
      render(<CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />);
      const image = screen.getByTestId('cta-background-image');
      expect(image.tagName).toBe('IMG');
      expect(image).toHaveAttribute('src', IMAGE_SRC);
      expect(screen.queryByTestId('cta-background-video')).not.toBeInTheDocument();
    });

    it('should hide a decorative background image from assistive tech', () => {
      render(<CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />);
      const image = screen.getByTestId('cta-background-image');
      expect(image).toHaveAttribute('aria-hidden', 'true');
      expect(image).toHaveAttribute('alt', '');
    });

    it('should expose a background image that has alt text', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC, alt: 'Team at work' }}
        />,
      );
      const image = screen.getByAltText('Team at work');
      expect(image).not.toHaveAttribute('aria-hidden');
    });

    it('should lazy-load background images by default and allow eager', () => {
      const { rerender } = render(
        <CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />,
      );
      expect(screen.getByTestId('cta-background-image')).toHaveAttribute('loading', 'lazy');

      rerender(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC, loading: 'eager' }}
        />,
      );
      expect(screen.getByTestId('cta-background-image')).toHaveAttribute('loading', 'eager');
    });

    it('should render a video and no image for a video background', () => {
      render(<CallToAction title="Title" background={{ type: 'video', src: VIDEO_SRC }} />);
      const video = screen.getByTestId('cta-background-video');
      expect(video.tagName).toBe('VIDEO');
      expect(screen.queryByTestId('cta-background-image')).not.toBeInTheDocument();
    });

    it('should render a single video source from a string src', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'video', src: VIDEO_SRC, poster: POSTER_SRC }}
        />,
      );
      const video = screen.getByTestId('cta-background-video');
      const sources = video.querySelectorAll('source');
      expect(sources).toHaveLength(1);
      expect(sources[0]).toHaveAttribute('src', VIDEO_SRC);
      expect(video).toHaveAttribute('poster', POSTER_SRC);
    });

    it('should render multiple video sources with their types', () => {
      render(
        <CallToAction
          title="Title"
          background={{
            type: 'video',
            src: [
              { src: '/a.webm', type: 'video/webm' },
              { src: '/a.mp4', type: 'video/mp4' },
            ],
          }}
        />,
      );
      const sources = screen.getByTestId('cta-background-video').querySelectorAll('source');
      expect(sources).toHaveLength(2);
      expect(sources[0]).toHaveAttribute('type', 'video/webm');
      expect(sources[1]).toHaveAttribute('src', '/a.mp4');
    });

    it('should switch cleanly from image to video when the background changes', () => {
      const { rerender } = render(
        <CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />,
      );
      expect(screen.getByTestId('cta-background-image')).toBeInTheDocument();

      rerender(<CallToAction title="Title" background={{ type: 'video', src: VIDEO_SRC }} />);
      expect(screen.queryByTestId('cta-background-image')).not.toBeInTheDocument();
      expect(screen.getByTestId('cta-background-video')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Video Behaviour / Reduced Motion
  // =========================================================================

  describe('Background video behaviour', () => {
    it('should be muted, inline and looping so it never autoplays with sound', () => {
      render(<CallToAction title="Title" background={{ type: 'video', src: VIDEO_SRC }} />);
      const video = screen.getByTestId('cta-background-video') as HTMLVideoElement;
      expect(video.muted).toBe(true);
      expect(video).toHaveAttribute('playsInline');
      expect(video).toHaveAttribute('loop');
      expect(video).toHaveAttribute('autoplay');
    });

    it('should hide the video from assistive tech and from the tab order', () => {
      render(<CallToAction title="Title" background={{ type: 'video', src: VIDEO_SRC }} />);
      const video = screen.getByTestId('cta-background-video');
      expect(video).toHaveAttribute('aria-hidden', 'true');
      expect(video).toHaveAttribute('tabindex', '-1');
    });

    it('should not autoplay when the user prefers reduced motion', () => {
      mockPrefersReducedMotion(true);
      render(
        <CallToAction
          title="Title"
          background={{ type: 'video', src: VIDEO_SRC, poster: POSTER_SRC }}
        />,
      );
      expect(screen.getByTestId('cta-background-video')).not.toHaveAttribute('autoplay');
    });

    it('should autoplay when the user does not prefer reduced motion', () => {
      mockPrefersReducedMotion(false);
      render(<CallToAction title="Title" background={{ type: 'video', src: VIDEO_SRC }} />);
      expect(screen.getByTestId('cta-background-video')).toHaveAttribute('autoplay');
    });

    it('should not autoplay when autoPlay is explicitly disabled', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'video', src: VIDEO_SRC, autoPlay: false }}
        />,
      );
      expect(screen.getByTestId('cta-background-video')).not.toHaveAttribute('autoplay');
    });
  });

  // =========================================================================
  // Overlay
  // =========================================================================

  describe('Overlay', () => {
    it('should not render an overlay when the prop is omitted', () => {
      render(<CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />);
      expect(screen.queryByTestId('cta-overlay')).not.toBeInTheDocument();
    });

    it('should render an overlay with the configured colour and opacity', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{ colour: 'rgb(255, 0, 0)', opacity: 0.6 }}
        />,
      );
      expect(screen.getByTestId('cta-overlay')).toHaveStyle({
        backgroundColor: 'rgb(255, 0, 0)',
        opacity: '0.6',
      });
    });

    it('should fall back to black at 0.5 opacity when overlay is empty', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{}}
        />,
      );
      expect(screen.getByTestId('cta-overlay')).toHaveStyle({
        backgroundColor: '#000000',
        opacity: '0.5',
      });
    });

    it('should honour an explicit zero opacity rather than treating it as unset', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{ opacity: 0 }}
        />,
      );
      expect(screen.getByTestId('cta-overlay')).toHaveStyle({ opacity: '0' });
    });

    it('should render an overlay over a video background', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'video', src: VIDEO_SRC }}
          overlay={{ opacity: 0.4 }}
        />,
      );
      expect(screen.getByTestId('cta-overlay')).toBeInTheDocument();
      expect(screen.getByTestId('cta-background-video')).toBeInTheDocument();
    });

    it('should apply an overlay className for gradient scrims', () => {
      render(
        <CallToAction
          title="Title"
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{ className: 'bg-gradient-to-t' }}
        />,
      );
      expect(screen.getByTestId('cta-overlay')).toHaveClass('bg-gradient-to-t');
    });

    it('should hide the overlay from assistive tech', () => {
      render(
        <CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} overlay={{}} />,
      );
      expect(screen.getByTestId('cta-overlay')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  // =========================================================================
  // Alignment
  // =========================================================================

  describe('Alignment', () => {
    it.each([
      ['left', 'text-left', 'items-start', 'justify-start'],
      ['center', 'text-center', 'items-center', 'justify-center'],
      ['right', 'text-right', 'items-end', 'justify-end'],
    ] as const)(
      'should apply %s alignment to text, content and buttons',
      (alignment, textClass, itemsClass, justifyClass) => {
        render(
          <CallToAction title="Title" alignment={alignment} buttons={[{ label: 'Go' }]} />,
        );
        expect(screen.getByRole('region')).toHaveAttribute('data-alignment', alignment);
        expect(screen.getByTestId('cta-content')).toHaveClass(textClass, itemsClass);
        expect(screen.getByTestId('cta-buttons')).toHaveClass(justifyClass);
      },
    );

    it('should default to centre alignment', () => {
      render(<CallToAction title="Title" />);
      expect(screen.getByRole('region')).toHaveAttribute('data-alignment', 'center');
      expect(screen.getByTestId('cta-content')).toHaveClass('text-center');
    });
  });

  // =========================================================================
  // Content Positioning
  // =========================================================================

  describe('Content positioning', () => {
    it.each([
      ['left', 'mr-auto'],
      ['center', 'mx-auto'],
      ['right', 'ml-auto'],
    ] as const)('should position content %s', (contentPosition, expectedClass) => {
      render(<CallToAction title="Title" contentPosition={contentPosition} />);
      expect(screen.getByRole('region')).toHaveAttribute(
        'data-content-position',
        contentPosition,
      );
      expect(screen.getByTestId('cta-content')).toHaveClass(expectedClass);
    });

    it('should default to centre positioning', () => {
      render(<CallToAction title="Title" />);
      expect(screen.getByTestId('cta-content')).toHaveClass('mx-auto');
    });

    it('should position content independently of text alignment', () => {
      render(<CallToAction title="Title" contentPosition="left" alignment="center" />);
      const content = screen.getByTestId('cta-content');
      expect(content).toHaveClass('mr-auto', 'text-center');
    });
  });

  // =========================================================================
  // Tone
  // =========================================================================

  describe('Tone', () => {
    it('should use dark text over a solid colour background', () => {
      render(<CallToAction title="Title" background={{ type: 'colour', colour: '#fff' }} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-slate-900');
    });

    it('should use light text over an image background', () => {
      render(<CallToAction title="Title" background={{ type: 'image', src: IMAGE_SRC }} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-white');
    });

    it('should let an explicit tone override the default', () => {
      render(
        <CallToAction title="Title" background={{ type: 'colour', colour: '#000' }} tone="light" />,
      );
      expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-white');
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations in the default state', async () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          description="Talk to us about your next project."
          buttons={[{ label: 'Book a call', href: '/contact' }]}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations with an image background and overlay', async () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          description="Talk to us about your next project."
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{ colour: '#000000', opacity: 0.6 }}
          buttons={twoButtons}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations with a video background and overlay', async () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          background={{ type: 'video', src: VIDEO_SRC, poster: POSTER_SRC }}
          overlay={{}}
          buttons={twoButtons}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations when the background image carries alt text', async () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          background={{ type: 'image', src: IMAGE_SRC, alt: 'Our team collaborating' }}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe('Edge cases', () => {
    it('should render long copy without dropping content', () => {
      const longTitle = 'A '.repeat(120).trim();
      render(<CallToAction title={longTitle} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(longTitle);
    });

    it('should apply wrapping classes so long copy and buttons do not overflow', () => {
      render(<CallToAction title="Title" buttons={twoButtons} />);
      expect(screen.getByTestId('cta-buttons')).toHaveClass('flex-wrap');
    });

    it('should render a ReactNode description', () => {
      render(<CallToAction title="Title" description={<strong>Bold copy</strong>} />);
      expect(screen.getByText('Bold copy').tagName).toBe('STRONG');
    });

    it('should render buttons that share a label without collapsing them', () => {
      render(
        <CallToAction
          title="Title"
          buttons={[
            { label: 'Go', href: '/a' },
            { label: 'Go', href: '/b' },
          ]}
        />,
      );
      expect(screen.getAllByRole('link', { name: 'Go' })).toHaveLength(2);
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default variant', () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          description="Talk to us about your next project."
          buttons={[{ label: 'Book a call', href: '/contact' }]}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the title-only variant', () => {
      const { container } = render(<CallToAction title="Ready to get started?" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the image background with overlay', () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          description="Talk to us about your next project."
          background={{ type: 'image', src: IMAGE_SRC }}
          overlay={{ colour: '#000000', opacity: 0.55 }}
          alignment="left"
          contentPosition="left"
          buttons={twoButtons}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the video background with overlay', () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          background={{ type: 'video', src: VIDEO_SRC, poster: POSTER_SRC }}
          overlay={{}}
          buttons={twoButtons}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the gradient background', () => {
      const { container } = render(
        <CallToAction
          title="Ready to get started?"
          background={{ type: 'gradient', gradient: 'linear-gradient(90deg, #db2777, #f97316)' }}
          alignment="right"
          contentPosition="right"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
