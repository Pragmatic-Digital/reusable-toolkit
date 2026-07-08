import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from './Separator';

describe('Separator Component', () => {
  describe('Basic Rendering', () => {
    it('should render a separator element', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toBeInTheDocument();
    });

    it('should apply default horizontal orientation', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('h-px', 'w-full');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Separator ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Orientation Variants', () => {
    it('should render horizontal separator', () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('h-px', 'w-full');
    });

    it('should render vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('h-full', 'w-px');
    });
  });

  describe('Decorative Text', () => {
    it('should render separator with decorative text', () => {
      const { getByText } = render(<Separator decorative="OR" />);
      const text = getByText('OR');
      expect(text).toBeInTheDocument();
    });

    it('should create left and right dividers with decorative text', () => {
      const { container } = render(<Separator decorative="OR" />);
      const dividers = container.querySelectorAll('div[role="presentation"]');
      expect(dividers.length).toBe(2);
    });

    it('should apply proper styling to decorative text', () => {
      const { getByText } = render(<Separator decorative="OR" />);
      const text = getByText('OR');
      expect(text.parentElement).toHaveClass('flex', 'items-center', 'gap-4');
    });
  });

  describe('Accessibility', () => {
    it('should have presentation role when decorative', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toHaveAttribute('role', 'presentation');
    });

    it('should have aria-hidden when decorative', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have separator role when not decorative', () => {
      const { container } = render(<Separator isDecorative={false} />);
      const separator = container.querySelector('div');
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('should not have aria-hidden when not decorative', () => {
      const { container } = render(<Separator isDecorative={false} />);
      const separator = container.querySelector('div');
      expect(separator).not.toHaveAttribute('aria-hidden');
    });
  });

  describe('Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Separator className="my-4" />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('my-4');
    });

    it('should have background colour', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('bg-slate-200');
    });

    it('should be shrunk (not grow beyond content)', () => {
      const { container } = render(<Separator />);
      const separator = container.querySelector('div');
      expect(separator).toHaveClass('shrink-0');
    });
  });

  describe('HTML Attributes', () => {
    it('should support standard HTML attributes', () => {
      const { container } = render(<Separator data-testid="custom-sep" />);
      const separator = container.querySelector('[data-testid="custom-sep"]');
      expect(separator).toBeInTheDocument();
    });

    it('should support aria attributes', () => {
      const { container } = render(<Separator aria-label="Section divider" />);
      const separator = container.querySelector('div');
      expect(separator).toHaveAttribute('aria-label', 'Section divider');
    });
  });

  describe('Edge Cases', () => {
    it('should render empty decorative text', () => {
      const { container } = render(<Separator decorative="" />);
      const separator = container.querySelector('div');
      expect(separator).toBeInTheDocument();
    });

    it('should handle long decorative text', () => {
      const { getByText } = render(<Separator decorative="Section Divider" />);
      expect(getByText('Section Divider')).toBeInTheDocument();
    });

    it('should render with whitespace preserving in decorative text', () => {
      const { getByText } = render(<Separator decorative="OR" />);
      const text = getByText('OR');
      expect(text).toHaveClass('whitespace-nowrap');
    });
  });
});
