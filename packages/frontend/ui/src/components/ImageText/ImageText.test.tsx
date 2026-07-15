import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import axe from 'axe-core';
import { ImageText } from './ImageText';

const IMAGE = 'https://cdn.example.com/section.jpg';
const IMAGE_ALT = 'Our team collaborating';

const findA11yViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    preload: false,
    rules: { 'color-contrast': { enabled: false } },
  });
  return results.violations.map((violation) => `${violation.id}: ${violation.help}`);
};

describe('ImageText Component', () => {
  // =========================================================================
  // Required props
  // =========================================================================

  describe('Required props only', () => {
    it('should render with only an image and title', () => {
      render(<ImageText image={IMAGE} imageAlt={IMAGE_ALT} title="About us" />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('About us');
      expect(screen.getByRole('img', { name: IMAGE_ALT })).toHaveAttribute('src', IMAGE);
    });

    it('should render as a section named by the title', () => {
      render(<ImageText image={IMAGE} title="About us" />);
      const section = screen.getByRole('region', { name: 'About us' });
      expect(section.tagName).toBe('SECTION');
    });

    it('should omit overline, description and CTA when only image and title are given', () => {
      render(<ImageText image={IMAGE} title="About us" />);
      expect(screen.queryByTestId('imagetext-overline')).not.toBeInTheDocument();
      expect(screen.queryByTestId('imagetext-description')).not.toBeInTheDocument();
      expect(screen.queryByTestId('imagetext-cta')).not.toBeInTheDocument();
    });

    it('should prefer an explicit ariaLabel over the title', () => {
      render(<ImageText image={IMAGE} title="About us" ariaLabel="Company overview" />);
      expect(screen.getByRole('region', { name: 'Company overview' })).toBeInTheDocument();
    });

    it('should render the title at the requested heading level', () => {
      render(<ImageText image={IMAGE} title="About us" headingLevel={3} />);
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('About us');
    });

    it('should default the heading to level 2', () => {
      render(<ImageText image={IMAGE} title="About us" />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should forward a ref to the section element', () => {
      const ref = { current: null as HTMLElement | null };
      render(<ImageText image={IMAGE} title="About us" ref={ref} />);
      expect(ref.current?.tagName).toBe('SECTION');
    });
  });

  // =========================================================================
  // Image
  // =========================================================================

  describe('Image', () => {
    it('should render the image with provided alt text and lazy loading', () => {
      render(<ImageText image={IMAGE} title="T" imageAlt={IMAGE_ALT} />);
      const img = screen.getByTestId('imagetext-image');
      expect(img).toHaveAttribute('alt', IMAGE_ALT);
      expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('should treat an image with no alt as decorative', () => {
      render(<ImageText image={IMAGE} title="T" />);
      const img = screen.getByTestId('imagetext-image');
      expect(img).toHaveAttribute('alt', '');
      expect(img).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('should apply the aspect ratio to the contained image frame', () => {
      render(<ImageText image={IMAGE} title="T" aspectRatio="16 / 9" />);
      expect(screen.getByTestId('imagetext-image-frame')).toHaveStyle({ aspectRatio: '16 / 9' });
    });

    it.each(['1 / 1', '16 / 9', '3 / 4'])('should apply the %s aspect ratio', (ratio) => {
      render(<ImageText image={IMAGE} title="T" aspectRatio={ratio} />);
      expect(screen.getByTestId('imagetext-image-frame')).toHaveStyle({ aspectRatio: ratio });
    });

    it('should use object-cover so the image is not distorted', () => {
      render(<ImageText image={IMAGE} title="T" />);
      expect(screen.getByTestId('imagetext-image')).toHaveClass('object-cover');
    });
  });

  // =========================================================================
  // Optional content
  // =========================================================================

  describe('Optional content', () => {
    it('should render the overline when provided', () => {
      render(<ImageText image={IMAGE} title="T" overline="OUR PROCESS" />);
      expect(screen.getByTestId('imagetext-overline')).toHaveTextContent('OUR PROCESS');
    });

    it('should render the description when provided', () => {
      render(<ImageText image={IMAGE} title="T" description="Supporting copy." />);
      expect(screen.getByTestId('imagetext-description')).toHaveTextContent('Supporting copy.');
    });

    it('should render a ReactNode description', () => {
      render(<ImageText image={IMAGE} title="T" description={<strong>Bold copy</strong>} />);
      expect(screen.getByText('Bold copy').tagName).toBe('STRONG');
    });
  });

  // =========================================================================
  // Image position & mobile order
  // =========================================================================

  describe('Image position', () => {
    it('should default to image-left', () => {
      render(<ImageText image={IMAGE} title="T" />);
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-image-position', 'left');
      expect(screen.getByTestId('imagetext-image-col')).toHaveClass('md:order-1');
      expect(screen.getByTestId('imagetext-text-col')).toHaveClass('md:order-2');
    });

    it('should place the image on the right when requested', () => {
      render(<ImageText image={IMAGE} title="T" imagePosition="right" />);
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-image-position', 'right');
      expect(screen.getByTestId('imagetext-image-col')).toHaveClass('md:order-2');
      expect(screen.getByTestId('imagetext-text-col')).toHaveClass('md:order-1');
    });

    it('should keep the image first in the DOM regardless of desktop position (default mobile order)', () => {
      const { rerender } = render(<ImageText image={IMAGE} title="T" imagePosition="left" />);
      const cols = () => Array.from(screen.getByTestId('imagetext').children);
      expect(cols()[0]).toHaveAttribute('data-testid', 'imagetext-image-col');

      rerender(<ImageText image={IMAGE} title="T" imagePosition="right" />);
      // Right-positioned image is placed via CSS order, so the DOM order is unchanged.
      expect(cols()[0]).toHaveAttribute('data-testid', 'imagetext-image-col');
    });
  });

  describe('Mobile stacking order', () => {
    it('should place the image first in the DOM by default', () => {
      render(<ImageText image={IMAGE} title="T" />);
      const children = Array.from(screen.getByTestId('imagetext').children);
      expect(children[0]).toHaveAttribute('data-testid', 'imagetext-image-col');
      expect(screen.getByTestId('imagetext-image-col')).toHaveClass('order-1');
    });

    it('should place the text first in the DOM when mobileOrder is text-first', () => {
      render(<ImageText image={IMAGE} title="T" mobileOrder="text-first" />);
      const children = Array.from(screen.getByTestId('imagetext').children);
      expect(children[0]).toHaveAttribute('data-testid', 'imagetext-text-col');
      expect(screen.getByTestId('imagetext-text-col')).toHaveClass('order-1');
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-mobile-order', 'text-first');
    });

    it('should keep the requested desktop image position under text-first mobile order', () => {
      render(<ImageText image={IMAGE} title="T" mobileOrder="text-first" imagePosition="left" />);
      // Text is first in DOM, but the image still sits left at desktop via CSS order.
      expect(screen.getByTestId('imagetext-image-col')).toHaveClass('md:order-1');
    });
  });

  // =========================================================================
  // Layout (contained vs full-bleed)
  // =========================================================================

  describe('Layout', () => {
    it('should default to the contained layout with a rounded frame at the aspect ratio', () => {
      render(<ImageText image={IMAGE} title="T" aspectRatio="4 / 3" />);
      const frame = screen.getByTestId('imagetext-image-frame');
      expect(frame).toHaveAttribute('data-layout', 'contained');
      expect(frame).toHaveClass('rounded-2xl');
      expect(frame).toHaveStyle({ aspectRatio: '4 / 3' });
    });

    it('should render a full-bleed layout without rounding on the frame', () => {
      render(<ImageText image={IMAGE} title="T" layout="full-bleed" />);
      const frame = screen.getByTestId('imagetext-image-frame');
      expect(frame).toHaveAttribute('data-layout', 'full-bleed');
      expect(frame).not.toHaveClass('rounded-2xl');
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-layout', 'full-bleed');
    });
  });

  // =========================================================================
  // Text alignment
  // =========================================================================

  describe('Text alignment', () => {
    it('should default to left alignment', () => {
      render(<ImageText image={IMAGE} title="T" />);
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-text-align', 'left');
      expect(screen.getByTestId('imagetext-text-col')).toHaveClass('text-left', 'items-start');
    });

    it('should apply centre alignment', () => {
      render(<ImageText image={IMAGE} title="T" textAlign="center" />);
      expect(screen.getByTestId('imagetext')).toHaveAttribute('data-text-align', 'center');
      expect(screen.getByTestId('imagetext-text-col')).toHaveClass('text-center', 'items-center');
    });
  });

  // =========================================================================
  // CTA
  // =========================================================================

  describe('CTA', () => {
    it('should render a link CTA with the correct label and href', () => {
      render(
        <ImageText image={IMAGE} title="T" cta={{ label: 'Learn more', href: '/process' }} />,
      );
      const cta = screen.getByTestId('imagetext-cta');
      expect(cta.tagName).toBe('A');
      expect(cta).toHaveAttribute('href', '/process');
      expect(cta).toHaveTextContent('Learn more');
    });

    it('should default the CTA to the primary variant', () => {
      render(<ImageText image={IMAGE} title="T" cta={{ label: 'Go', href: '/x' }} />);
      expect(screen.getByTestId('imagetext-cta')).toHaveAttribute('data-variant', 'primary');
    });

    it('should apply the requested CTA variant', () => {
      render(
        <ImageText image={IMAGE} title="T" cta={{ label: 'Go', href: '/x', variant: 'outline' }} />,
      );
      expect(screen.getByTestId('imagetext-cta')).toHaveAttribute('data-variant', 'outline');
    });

    it('should render a button CTA and fire onClick when there is no href', () => {
      const onClick = vi.fn();
      render(<ImageText image={IMAGE} title="T" cta={{ label: 'Do it', onClick }} />);
      const cta = screen.getByTestId('imagetext-cta');
      expect(cta.tagName).toBe('BUTTON');
      fireEvent.click(cta);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should default rel to noopener noreferrer for target _blank', () => {
      render(
        <ImageText
          image={IMAGE}
          title="T"
          cta={{ label: 'External', href: 'https://example.com', target: '_blank' }}
        />,
      );
      expect(screen.getByTestId('imagetext-cta')).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should use the CTA ariaLabel as its accessible name', () => {
      render(
        <ImageText
          image={IMAGE}
          title="T"
          cta={{ label: 'Go', href: '/x', ariaLabel: 'Learn more about our process' }}
        />,
      );
      expect(screen.getByRole('link', { name: 'Learn more about our process' })).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Accessibility
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no axe violations for the default section', async () => {
      const { container } = render(
        <ImageText
          image={IMAGE}
          imageAlt={IMAGE_ALT}
          overline="Our process"
          title="From idea to launch"
          description="How we work with you."
          cta={{ label: 'Learn more', href: '/process' }}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for a decorative-image, title-only section', async () => {
      const { container } = render(<ImageText image={IMAGE} title="About us" />);
      expect(await findA11yViolations(container)).toEqual([]);
    });

    it('should have no axe violations for the full-bleed, image-right variant', async () => {
      const { container } = render(
        <ImageText
          image={IMAGE}
          imageAlt={IMAGE_ALT}
          title="From idea to launch"
          description="How we work with you."
          layout="full-bleed"
          imagePosition="right"
          cta={{ label: 'Learn more', href: '/process' }}
        />,
      );
      expect(await findA11yViolations(container)).toEqual([]);
    });
  });

  // =========================================================================
  // Snapshots
  // =========================================================================

  describe('Snapshots', () => {
    it('should match the snapshot for the default (image-left) variant', () => {
      const { container } = render(
        <ImageText
          image={IMAGE}
          imageAlt={IMAGE_ALT}
          overline="Our process"
          title="From idea to launch"
          description="How we work with you."
          cta={{ label: 'Learn more', href: '/process' }}
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the image-right variant', () => {
      const { container } = render(
        <ImageText
          image={IMAGE}
          imageAlt={IMAGE_ALT}
          title="From idea to launch"
          description="How we work with you."
          imagePosition="right"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match the snapshot for the full-bleed variant', () => {
      const { container } = render(
        <ImageText
          image={IMAGE}
          imageAlt={IMAGE_ALT}
          title="From idea to launch"
          description="How we work with you."
          layout="full-bleed"
          textAlign="center"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
