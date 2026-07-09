import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { NavigationMenu } from './NavigationMenu';

describe('NavigationMenu Component', () => {
  const mockItems = [
    {
      trigger: { label: 'Products' },
      content: [
        { label: 'Featured', href: '/featured' },
        { label: 'New', href: '/new' },
      ],
    },
    {
      trigger: { label: 'Services' },
      content: [
        { label: 'Consulting', href: '/consulting' },
        { label: 'Support', href: '/support' },
      ],
    },
  ];

  describe('Basic Rendering', () => {
    it('should render menu triggers', () => {
      render(<NavigationMenu items={mockItems} />);
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should render menu content when trigger is activated', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={mockItems} />);

      const trigger = screen.getByText('Products');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Featured')).toBeInTheDocument();
      });
    });
  });

  describe('Menu Items', () => {
    it('should render all menu items in content', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={mockItems} />);

      const trigger = screen.getByText('Products');
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('Featured')).toBeInTheDocument();
        expect(screen.getByText('New')).toBeInTheDocument();
      });
    });

    it('should handle link clicks', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={mockItems} />);

      const trigger = screen.getByText('Products');
      await user.click(trigger);

      const link = screen.getByText('Featured');
      expect(link).toHaveAttribute('href', '/featured');
    });

    it('should handle button clicks', async () => {
      const onClick = vi.fn();
      const items = [
        {
          trigger: { label: 'Menu' },
          content: [
            { label: 'Action', onClick },
          ],
        },
      ];

      const user = userEvent.setup();
      render(<NavigationMenu items={items} />);

      await user.click(screen.getByText('Menu'));
      await user.click(screen.getByText('Action'));

      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Icons', () => {
    it('should render trigger icon', () => {
      const items = [
        {
          trigger: { label: 'Menu', icon: '📦' },
          content: [],
        },
      ];

      render(<NavigationMenu items={items} />);
      expect(screen.getByText('📦')).toBeInTheDocument();
    });

    it('should render content item icons', async () => {
      const user = userEvent.setup();
      const items = [
        {
          trigger: { label: 'Menu' },
          content: [
            { label: 'Item', href: '/', icon: '⭐' },
          ],
        },
      ];

      render(<NavigationMenu items={items} />);
      await user.click(screen.getByText('Menu'));

      await waitFor(() => {
        expect(screen.getByText('⭐')).toBeInTheDocument();
      });
    });
  });

  describe('Description', () => {
    it('should render description when provided', async () => {
      const user = userEvent.setup();
      const items = [
        {
          trigger: { label: 'Menu' },
          description: 'Menu description',
          content: [
            { label: 'Item', href: '/' },
          ],
        },
      ];

      render(<NavigationMenu items={items} />);
      await user.click(screen.getByText('Menu'));

      await waitFor(() => {
        expect(screen.getByText('Menu description')).toBeInTheDocument();
      });
    });
  });

  describe('Custom Content', () => {
    it('should render custom content when not array', async () => {
      const user = userEvent.setup();
      const items = [
        {
          trigger: { label: 'Menu' },
          content: <div data-testid="custom">Custom Content</div>,
        },
      ];

      render(<NavigationMenu items={items} />);
      await user.click(screen.getByText('Menu'));

      await waitFor(() => {
        expect(screen.getByTestId('custom')).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should close menu on Escape', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={mockItems} />);

      await user.click(screen.getByText('Products'));
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Featured')).not.toBeInTheDocument();
      });
    });
  });

  describe('Orientation', () => {
    it('should support horizontal orientation', () => {
      const { container } = render(
        <NavigationMenu items={mockItems} orientation="horizontal" />
      );
      const root = container.querySelector('[role="navigation"]');
      expect(root).toBeInTheDocument();
    });

    it('should support vertical orientation', () => {
      const { container } = render(
        <NavigationMenu items={mockItems} orientation="vertical" />
      );
      const root = container.querySelector('[role="navigation"]');
      expect(root).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply custom container className', () => {
      const { container } = render(
        <NavigationMenu items={mockItems} containerClassName="custom-container" />
      );
      const root = container.querySelector('[role="navigation"]');
      expect(root).toHaveClass('custom-container');
    });

    it('should apply custom trigger className', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <NavigationMenu items={mockItems} triggerClassName="custom-trigger" />
      );

      const trigger = container.querySelector('button');
      expect(trigger).toHaveClass('custom-trigger');
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref to root element', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<NavigationMenu ref={ref} items={mockItems} />);
      expect(ref.current).toBeInTheDocument();
    });
  });

  describe('Multiple Menu Items', () => {
    it('should handle switching between menu items', async () => {
      const user = userEvent.setup();
      render(<NavigationMenu items={mockItems} />);

      await user.click(screen.getByText('Products'));
      await waitFor(() => {
        expect(screen.getByText('Featured')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Services'));
      await waitFor(() => {
        expect(screen.getByText('Consulting')).toBeInTheDocument();
      });
    });
  });
});
