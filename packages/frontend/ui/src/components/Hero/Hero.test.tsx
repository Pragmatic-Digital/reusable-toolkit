import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero Component', () => {
  // =========================================================================
  // Basic Rendering Tests
  // =========================================================================

  describe('Basic Rendering', () => {
    it('should render with required title prop', () => {
      render(<Hero title="Test Hero Title" />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Test Hero Title',
      );
    });

    it('should render as a section element', () => {
      render(<Hero title="Test Title" />);
      const section = screen.getByRole('region');
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe('SECTION');
    });

    it('should render with custom aria-label', () => {
      render(
        <Hero title="Test" ariaLabel="Custom aria label for hero" />,
      );
      const section = screen.getByRole('region', {
        name: /custom aria label/i,
      });
      expect(section).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Hero title="Test" className="custom-class" />,
      );
      const section = container.querySelector('section');
      expect(section).toHaveClass('custom-class');
    });
  });

  // =========================================================================
  // Content Rendering Tests
  // =========================================================================

  describe('Content Rendering', () => {
    it('should render title', () => {
      render(<Hero title="Main Title" />);
      expect(screen.getByText('Main Title')).toBeInTheDocument();
    });

    it('should render subtitle when provided', () => {
      render(<Hero title="Title" subtitle="Test Subtitle" />);
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      render(<Hero title="Title" />);
      expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <Hero title="Title" description="Test Description" />,
      );
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should not render description when not provided', () => {
      render(<Hero title="Title" />);
      expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
    });

    it('should render with custom title aria-label', () => {
      render(
        <Hero
          title="Title"
          titleAriaLabel="Custom heading label"
        />,
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveAttribute('aria-label', 'Custom heading label');
    });
  });

  // =========================================================================
  // Background Type Tests
  // =========================================================================

  describe('Background Types', () => {
    it('should render with solid colour background by default', () => {
      const { container } = render(
        <Hero title="Test" backgroundType="colour" backgroundColour="bg-blue-600" />,
      );
      const background = container.querySelector('.absolute.inset-0');
      expect(background).toBeInTheDocument();
    });

    it('should apply background colour style', () => {
      const { container } = render(
        <Hero title="Test" backgroundType="colour" backgroundColour="bg-blue-600" />,
      );
      const background = container.querySelector('.absolute.inset-0');
      expect(background).toHaveStyle({ backgroundColor: 'bg-blue-600' });
    });

    it('should render image background when type is image', () => {
      const { container } = render(
        <Hero
          title="Test"
          backgroundType="image"
          backgroundImage="https://example.com/image.jpg"
        />,
      );
      const background = container.querySelector('.absolute.inset-0');
      expect(background).toBeInTheDocument();
    });

    it('should render video element when type is video', () => {
      render(
        <Hero
          title="Test"
          backgroundType="video"
          backgroundVideo="https://example.com/video.mp4"
        />,
      );
      const video = screen.queryByRole('region', { hidden: true });
      expect(video?.querySelector('video')).toBeInTheDocument();
    });

    it('should apply video attributes correctly', () => {
      const { container } = render(
        <Hero
          title="Test"
          backgroundType="video"
          backgroundVideo="https://example.com/video.mp4"
          backgroundVideoPoster="https://example.com/poster.jpg"
        />,
      );
      const video = container.querySelector('video');
      expect(video).toHaveAttribute('autoplay');
      expect(video).toHaveAttribute('muted');
      expect(video).toHaveAttribute('loop');
      expect(video).toHaveAttribute('poster', 'https://example.com/poster.jpg');
    });

    it('should render gradient background when type is gradient', () => {
      const { container } = render(
        <Hero
          title="Test"
          backgroundType="gradient"
          gradient={{ from: '#000', to: '#fff', direction: 'to-right' }}
        />,
      );
      const background = container.querySelector('.absolute.inset-0');
      expect(background).toHaveStyle({ background: expect.stringContaining('linear-gradient') });
    });
  });

  // =========================================================================
  // Overlay Tests
  // =========================================================================

  describe('Overlay', () => {
    it('should render overlay with default opacity', () => {
      const { container } = render(
        <Hero title="Test" overlay={{ colour: 'black', opacity: 0.4 }} />,
      );
      const overlays = container.querySelectorAll('.absolute.inset-0');
      // Should have background and overlay
      expect(overlays.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply custom overlay colour and opacity', () => {
      const { container } = render(
        <Hero
          title="Test"
          overlay={{ colour: 'rgba(255, 0, 0, 1)', opacity: 0.6 }}
        />,
      );
      const overlays = container.querySelectorAll('.absolute.inset-0');
      const overlay = overlays[overlays.length - 1]; // Last overlay div
      expect(overlay).toHaveStyle({ opacity: '0.6' });
    });

    it('should render with zero overlay opacity', () => {
      const { container } = render(
        <Hero title="Test" overlay={{ colour: 'black', opacity: 0 }} />,
      );
      const overlays = container.querySelectorAll('.absolute.inset-0');
      const overlay = overlays[overlays.length - 1];
      expect(overlay).toHaveStyle({ opacity: '0' });
    });
  });

  // =========================================================================
  // Layout Tests
  // =========================================================================

  describe('Layout Variants', () => {
    it('should render centred layout by default', () => {
      const { container } = render(<Hero title="Test" layout="centered" />);
      const content = container.querySelector('.flex.flex-col');
      expect(content).toHaveClass('items-center', 'justify-center', 'text-center');
    });

    it('should render left-aligned layout', () => {
      const { container } = render(<Hero title="Test" layout="left" />);
      const content = container.querySelector('.flex.flex-col');
      expect(content).toHaveClass('items-center', 'justify-start', 'text-left');
    });

    it('should render right-aligned layout', () => {
      const { container } = render(<Hero title="Test" layout="right" />);
      const content = container.querySelector('.flex.flex-col');
      expect(content).toHaveClass('items-center', 'justify-end', 'text-right');
    });
  });

  // =========================================================================
  // Heading Size Tests
  // =========================================================================

  describe('Heading Sizes', () => {
    it('should render small heading by default', () => {
      render(
        <Hero title="Test" headingSize="small" />,
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl');
    });

    it('should render medium heading', () => {
      render(
        <Hero title="Test" headingSize="medium" />,
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl');
    });

    it('should render large heading', () => {
      render(
        <Hero title="Test" headingSize="large" />,
      );
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-5xl', 'sm:text-6xl');
    });
  });

  // =========================================================================
  // Button Tests
  // =========================================================================

  describe('Buttons', () => {
    it('should not render buttons when not provided', () => {
      render(<Hero title="Test" />);
      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });

    it('should render buttons when provided', () => {
      render(
        <Hero
          title="Test"
          buttons={[
            { label: 'Button 1' },
            { label: 'Button 2' },
          ]}
        />,
      );
      expect(screen.getAllByRole('button')).toHaveLength(2);
    });

    it('should render button with correct label', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Test Button' }]}
        />,
      );
      expect(screen.getByText('Test Button')).toBeInTheDocument();
    });

    it('should call onClick handler when button is clicked', () => {
      const handleClick = vi.fn();
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Click Me', onClick: handleClick }]}
        />,
      );
      const button = screen.getByText('Click Me');
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should disable button when disabled prop is true', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Disabled Button', disabled: true }]}
        />,
      );
      const button = screen.getByText('Disabled Button') as HTMLButtonElement;
      expect(button.disabled).toBe(true);
    });

    it('should apply primary variant class by default', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Button', variant: 'primary' }]}
        />,
      );
      const button = screen.getByText('Button');
      expect(button).toHaveClass('bg-white', 'text-gray-900');
    });

    it('should apply secondary variant class', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Button', variant: 'secondary' }]}
        />,
      );
      const button = screen.getByText('Button');
      expect(button).toHaveClass('bg-gray-600');
    });

    it('should apply outline variant class', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Button', variant: 'outline' }]}
        />,
      );
      const button = screen.getByText('Button');
      expect(button).toHaveClass('bg-transparent', 'border-2', 'border-white');
    });

    it('should render button with custom aria-label', () => {
      render(
        <Hero
          title="Test"
          buttons={[{
            label: 'Button',
            ariaLabel: 'Custom button label',
          }]}
        />,
      );
      const button = screen.getByRole('button', { name: /custom button label/i });
      expect(button).toBeInTheDocument();
    });

    it('should render button group with accessible role', () => {
      render(
        <Hero
          title="Test"
          buttons={[
            { label: 'Button 1' },
            { label: 'Button 2' },
          ]}
        />,
      );
      const buttonGroup = screen.getByRole('group', { name: /call to action buttons/i });
      expect(buttonGroup).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Accessibility', () => {
    it('should render semantic section element', () => {
      render(<Hero title="Test" />);
      const section = screen.getByRole('region');
      expect(section.tagName).toBe('SECTION');
    });

    it('should have proper heading hierarchy', () => {
      render(
        <Hero
          title="Main Title"
          subtitle="Subtitle"
        />,
      );
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h1).toHaveTextContent('Main Title');
      expect(h2).toHaveTextContent('Subtitle');
    });

    it('should have aria-hidden on decorative elements', () => {
      const { container } = render(
        <Hero title="Test" backgroundType="image" backgroundImage="url" />,
      );
      const decorative = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorative.length).toBeGreaterThan(0);
    });

    it('should have proper role attribute', () => {
      render(<Hero title="Test" role="banner" />);
      const section = screen.getByRole('banner');
      expect(section).toBeInTheDocument();
    });

    it('should render with custom aria-label for section', () => {
      render(
        <Hero
          title="Test"
          ariaLabel="Main hero banner section"
        />,
      );
      const section = screen.getByRole('region', {
        name: /main hero banner section/i,
      });
      expect(section).toBeInTheDocument();
    });

    it('should have proper button focus styles', () => {
      render(
        <Hero
          title="Test"
          buttons={[{ label: 'Button' }]}
        />,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus:ring-2');
    });

    it('should have proper color contrast', () => {
      render(
        <Hero
          title="Test"
          subtitle="Subtitle"
          description="Description"
        />,
      );
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h1).toHaveClass('text-white');
      expect(h2).toHaveClass('text-white');
    });
  });

  // =========================================================================
  // Children and Customisation Tests
  // =========================================================================

  describe('Children and Customisation', () => {
    it('should render children instead of default content', () => {
      render(
        <Hero title="Test">
          <div>Custom Content</div>
        </Hero>,
      );
      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });

    it('should apply custom min height', () => {
      render(
        <Hero title="Test" minHeight={600} />,
      );
      const section = screen.getByRole('region');
      expect(section).toHaveStyle({ minHeight: '600px' });
    });

    it('should have correct z-index layering', () => {
      const { container } = render(
        <Hero title="Test" backgroundType="image" backgroundImage="url" />,
      );
      const content = container.querySelector('.relative.z-10');
      expect(content).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Responsive Tests
  // =========================================================================

  describe('Responsive Design', () => {
    it('should apply responsive padding classes', () => {
      const { container } = render(<Hero title="Test" />);
      const content = container.querySelector('.px-4.sm\\:px-6.lg\\:px-8');
      expect(content).toBeInTheDocument();
    });

    it('should apply responsive text size classes to heading', () => {
      render(<Hero title="Test" headingSize="large" />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveClass('text-5xl', 'sm:text-6xl');
    });

    it('should apply responsive text size classes to subtitle', () => {
      render(
        <Hero title="Test" subtitle="Subtitle" headingSize="large" />,
      );
      const subtitle = screen.getByRole('heading', { level: 2 });
      expect(subtitle).toHaveClass('text-xl', 'sm:text-2xl');
    });
  });

  // =========================================================================
  // Edge Cases and Integration Tests
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle empty strings gracefully', () => {
      render(
        <Hero
          title=""
          subtitle=""
          description=""
        />,
      );
      expect(screen.getByRole('region')).toBeInTheDocument();
    });

    it('should handle very long titles', () => {
      const longTitle =
        'This is a very long title that tests text wrapping and overflow handling in the Hero component';
      render(<Hero title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle multiple buttons with various states', () => {
      render(
        <Hero
          title="Test"
          buttons={[
            { label: 'Button 1', variant: 'primary' },
            { label: 'Button 2', variant: 'secondary', disabled: true },
            { label: 'Button 3', variant: 'outline' },
          ]}
        />,
      );
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('should be forwardRef compatible', () => {
      const ref = { current: null as HTMLElement | null };
      render(<Hero title="Test" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe('SECTION');
    });
  });
});
