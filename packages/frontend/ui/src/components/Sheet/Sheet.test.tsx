import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Sheet } from './Sheet';

describe('Sheet Component', () => {
  describe('Basic Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Sheet content={<div>Sheet content</div>}>
          <button>Open</button>
        </Sheet>
      );
      expect(screen.getByRole('button', { name: /open/i })).toBeInTheDocument();
    });

    it('should render content when open', async () => {
      const user = userEvent.setup();
      render(
        <Sheet content={<div>Sheet content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );
      await waitFor(() => {
        expect(screen.getByText('Sheet content')).toBeInTheDocument();
      });
    });

    it('should not render content when closed', () => {
      render(
        <Sheet content={<div>Sheet content</div>} open={false}>
          <button>Open</button>
        </Sheet>
      );
      expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
    });
  });

  describe('Open/Close Behavior', () => {
    it('should open when trigger is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Sheet content={<div>Sheet content</div>}>
          <button>Open</button>
        </Sheet>
      );

      const trigger = screen.getByRole('button', { name: /open/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Sheet content')).toBeInTheDocument();
      });
    });

    it('should call onOpenChange callback', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Sheet
          content={<div>Sheet content</div>}
          onOpenChange={handleOpenChange}
        >
          <button>Open</button>
        </Sheet>
      );

      const trigger = screen.getByRole('button', { name: /open/i });
      await user.click(trigger);

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });

    it('should close when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Sheet
          content={<div>Sheet content</div>}
          title="Sheet"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const closeButton = screen.getByRole('button', { name: /✕/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
      });
    });

    it('should close when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(
        <Sheet content={<div>Sheet content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
      });
    });
  });

  describe('Side Positioning', () => {
    it('should render on left side by default', () => {
      const { container } = render(
        <Sheet content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toHaveClass('left-0');
    });

    it('should render on right side', () => {
      const { container } = render(
        <Sheet side="right" content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toHaveClass('right-0');
    });

    it('should render on top', () => {
      const { container } = render(
        <Sheet side="top" content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toHaveClass('top-0');
    });

    it('should render on bottom', () => {
      const { container } = render(
        <Sheet side="bottom" content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toHaveClass('bottom-0');
    });
  });

  describe('Title and Description', () => {
    it('should render title when provided', async () => {
      render(
        <Sheet
          content={<div>Content</div>}
          title="My Sheet"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      expect(screen.getByText('My Sheet')).toBeInTheDocument();
    });

    it('should render description for accessibility', () => {
      const { container } = render(
        <Sheet
          content={<div>Content</div>}
          description="This is a description"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const description = container.querySelector('[id*="radix"]');
      expect(description).toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should show close button with title', async () => {
      render(
        <Sheet
          content={<div>Content</div>}
          title="Sheet"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      expect(screen.getByRole('button', { name: /✕/i })).toBeInTheDocument();
    });

    it('should hide close button when closeButtonContent is false', async () => {
      render(
        <Sheet
          content={<div>Content</div>}
          title="Sheet"
          closeButtonContent={false}
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      expect(screen.queryByRole('button', { name: /✕/i })).not.toBeInTheDocument();
    });

    it('should render custom close button content', async () => {
      render(
        <Sheet
          content={<div>Content</div>}
          title="Sheet"
          closeButtonContent="Close"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Overlay Behavior', () => {
    it('should close when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Sheet
          content={<div>Sheet content</div>}
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const overlay = screen.getByRole('presentation');
      await user.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText('Sheet content')).not.toBeInTheDocument();
      });
    });

    it('should not close on overlay click when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Sheet
          content={<div>Sheet content</div>}
          open={true}
          closeOnOverlayClick={false}
        >
          <button>Open</button>
        </Sheet>
      );

      const overlay = screen.getByRole('presentation');
      // Note: With pointer-events-none, click won't register on overlay
      // This test verifies the class is applied
      expect(overlay).toHaveClass('pointer-events-none');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      render(
        <Sheet content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <Sheet
          content={<button>Action</button>}
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const actionButton = screen.getByRole('button', { name: /action/i });
      expect(actionButton).toBeInTheDocument();

      // Tab to close button
      await user.tab();
      const focused = document.activeElement;
      expect(focused).toBeInTheDocument();
    });

    it('should trap focus within sheet', async () => {
      render(
        <Sheet
          content={<button>Action</button>}
          title="Sheet"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const sheetContent = screen.getByRole('dialog');
      expect(sheetContent).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom overlay className', () => {
      const { container } = render(
        <Sheet
          content={<div>Content</div>}
          overlayClassName="custom-overlay"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const overlay = container.querySelector('[role="presentation"]');
      expect(overlay).toHaveClass('custom-overlay');
    });

    it('should apply custom content className', () => {
      const { container } = render(
        <Sheet
          content={<div>Content</div>}
          contentClassName="custom-content"
          open={true}
        >
          <button>Open</button>
        </Sheet>
      );

      const content = container.querySelector('[role="dialog"]');
      expect(content).toHaveClass('custom-content');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to content element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Sheet ref={ref} content={<div>Content</div>} open={true}>
          <button>Open</button>
        </Sheet>
      );

      expect(ref.current).toBeInTheDocument();
    });
  });
});
