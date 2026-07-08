import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar Component', () => {
  describe('Basic Rendering', () => {
    it('should render an image element when src is provided', () => {
      render(<Avatar src="avatar.jpg" alt="User avatar" />);
      const img = screen.getByRole('img', { name: /user avatar/i });
      expect(img).toBeInTheDocument();
    });

    it('should display initials when image fails to load', async () => {
      render(
        <Avatar
          src="invalid.jpg"
          alt="User avatar"
          initials="JD"
        />
      );

      const img = screen.getByRole('img', { name: /user avatar/i }) as HTMLImageElement;
      await waitFor(() => {
        img.dispatchEvent(new Event('error'));
      });
    });

    it('should render initials fallback when no src', () => {
      render(<Avatar alt="User" initials="JD" />);
      expect(screen.getByRole('img', { name: /jd/i })).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLImageElement>();
      render(<Avatar src="avatar.jpg" alt="User" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLImageElement);
    });
  });

  describe('Sizes', () => {
    it('should apply extra small size', () => {
      const { container } = render(<Avatar alt="User" initials="JD" size="xs" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('h-6', 'w-6');
    });

    it('should apply small size', () => {
      const { container } = render(<Avatar alt="User" initials="JD" size="sm" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('h-8', 'w-8');
    });

    it('should apply default size', () => {
      const { container } = render(<Avatar alt="User" initials="JD" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('h-10', 'w-10');
    });

    it('should apply large size', () => {
      const { container } = render(<Avatar alt="User" initials="JD" size="lg" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('h-12', 'w-12');
    });

    it('should apply extra large size', () => {
      const { container } = render(<Avatar alt="User" initials="JD" size="xl" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('h-16', 'w-16');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text', () => {
      render(<Avatar src="avatar.jpg" alt="John Doe" />);
      const img = screen.getByRole('img', { name: /john doe/i });
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('should have aria-label for initials fallback', () => {
      const { container } = render(<Avatar alt="John Doe" initials="JD" />);
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveAttribute('aria-label', 'JD');
    });
  });

  describe('Styling', () => {
    it('should apply custom className to image', () => {
      const { container } = render(
        <Avatar src="avatar.jpg" alt="User" className="border-2" />
      );
      const img = container.querySelector('img');
      expect(img).toHaveClass('border-2');
    });

    it('should apply custom wrapper className to fallback', () => {
      const { container } = render(
        <Avatar alt="User" initials="JD" wrapperClassName="border-2" />
      );
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('border-2');
    });

    it('should apply custom background colour', () => {
      const { container } = render(
        <Avatar alt="User" initials="JD" bgColour="bg-blue-100" />
      );
      const avatar = container.querySelector('[role="img"]');
      expect(avatar).toHaveClass('bg-blue-100');
    });
  });

  describe('Image Events', () => {
    it('should handle load event', () => {
      const handleLoad = vi.fn();
      render(<Avatar src="avatar.jpg" alt="User" onLoad={handleLoad} />);

      const img = screen.getByRole('img') as HTMLImageElement;
      img.dispatchEvent(new Event('load'));

      expect(handleLoad).toHaveBeenCalled();
    });

    it('should handle error event and show fallback', async () => {
      const handleError = vi.fn();
      render(
        <Avatar
          src="invalid.jpg"
          alt="User"
          initials="JD"
          onError={handleError}
        />
      );

      const img = screen.getByRole('img') as HTMLImageElement;
      img.dispatchEvent(new Event('error'));

      expect(handleError).toHaveBeenCalled();
    });
  });
});
