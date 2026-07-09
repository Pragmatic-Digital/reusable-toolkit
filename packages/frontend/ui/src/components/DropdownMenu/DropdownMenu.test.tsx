import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DropdownMenu } from './DropdownMenu';

describe('DropdownMenu Component', () => {
  const mockItems = [
    { label: 'Profile', onClick: vi.fn() },
    { label: 'Settings', onClick: vi.fn() },
    { label: 'Logout', onClick: vi.fn(), variant: 'destructive' as const },
  ];

  describe('Basic Rendering', () => {
    it('should render trigger element', () => {
      render(
        <DropdownMenu items={mockItems}>
          <button>Menu</button>
        </DropdownMenu>
      );
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('should render menu content when opened', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={mockItems}>
          <button>Menu</button>
        </DropdownMenu>
      );

      const trigger = screen.getByRole('button', { name: /menu/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
      });
    });
  });

  describe('Menu Items', () => {
    it('should render all menu items', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={mockItems}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));

      await waitFor(() => {
        mockItems.forEach((item) => {
          expect(screen.getByText(item.label)).toBeInTheDocument();
        });
      });
    });

    it('should call onClick when item is clicked', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const items = [{ label: 'Action', onClick }];

      render(
        <DropdownMenu items={items}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));
      await user.click(screen.getByText('Action'));

      expect(onClick).toHaveBeenCalled();
    });

    it('should disable menu items', async () => {
      const user = userEvent.setup();
      const items = [{ label: 'Disabled', onClick: vi.fn(), disabled: true }];

      render(
        <DropdownMenu items={items}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));
      const item = screen.getByText('Disabled');
      expect(item).toHaveClass('opacity-50');
    });
  });

  describe('Title', () => {
    it('should render title when provided', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={mockItems} title="User Menu">
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));

      await waitFor(() => {
        expect(screen.getByText('User Menu')).toBeInTheDocument();
      });
    });
  });

  describe('Variants', () => {
    it('should apply destructive variant styling', async () => {
      const user = userEvent.setup();
      const items = [{ label: 'Delete', onClick: vi.fn(), variant: 'destructive' as const }];

      render(
        <DropdownMenu items={items}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));
      const item = screen.getByText('Delete');
      expect(item).toHaveClass('text-red-600');
    });
  });

  describe('Icons', () => {
    it('should render item icons', async () => {
      const user = userEvent.setup();
      const items = [
        {
          label: 'Profile',
          onClick: vi.fn(),
          icon: <span data-testid="icon">👤</span>,
        },
      ];

      render(
        <DropdownMenu items={items}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));

      await waitFor(() => {
        expect(screen.getByTestId('icon')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close menu on Escape', async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu items={mockItems}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Profile')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to content element', async () => {
      const ref = React.createRef<HTMLDivElement>();
      const user = userEvent.setup();

      render(
        <DropdownMenu ref={ref} items={mockItems}>
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));

      await waitFor(() => {
        expect(ref.current).toBeInTheDocument();
      });
    });
  });

  describe('Styling', () => {
    it('should apply custom content className', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <DropdownMenu items={mockItems} contentClassName="custom-class">
          <button>Menu</button>
        </DropdownMenu>
      );

      await user.click(screen.getByRole('button', { name: /menu/i }));

      await waitFor(() => {
        const content = container.querySelector('[role="menu"]');
        expect(content).toHaveClass('custom-class');
      });
    });
  });
});
