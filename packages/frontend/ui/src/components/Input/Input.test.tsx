import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input Component', () => {
  describe('Basic Rendering', () => {
    it('should render an input element', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('should accept placeholder prop', () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Input className="custom-class" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Label', () => {
    it('should render label when provided', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username');
      expect(label).toBeInTheDocument();
    });

    it('should associate label with input', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username') as HTMLLabelElement;
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(label.htmlFor).toBe(input.id);
    });

    it('should show required indicator when required', () => {
      const { container } = render(<Input label="Username" required />);
      const label = container.querySelector('label');
      expect(label).toHaveClass("after:content-['*']");
    });

    it('should apply custom label className', () => {
      const { container } = render(<Input label="Username" labelClassName="text-red-500" />);
      const label = container.querySelector('label');
      expect(label).toHaveClass('text-red-500');
    });
  });

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(<Input errorMessage="Email is required" />);
      const error = screen.getByText('Email is required');
      expect(error).toBeInTheDocument();
    });

    it('should apply error styling when error message is present', () => {
      const { container } = render(<Input errorMessage="Email is required" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('border-red-500');
    });

    it('should have error role for accessibility', () => {
      render(<Input errorMessage="Email is required" />);
      const error = screen.getByText('Email is required');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('should have aria-live for dynamic error updates', () => {
      render(<Input errorMessage="Email is required" />);
      const error = screen.getByText('Email is required');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });

    it('should apply custom error className', () => {
      const { container } = render(
        <Input errorMessage="Email is required" errorClassName="text-red-700" />
      );
      const error = screen.getByText('Email is required');
      expect(error).toHaveClass('text-red-700');
    });

    it('should prioritise error message over helper text', () => {
      render(
        <Input
          errorMessage="Email is required"
          helperText="Enter a valid email"
        />
      );
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text when provided', () => {
      render(<Input helperText="Enter a valid email address" />);
      const helper = screen.getByText('Enter a valid email address');
      expect(helper).toBeInTheDocument();
    });

    it('should not display helper text when error is present', () => {
      render(
        <Input
          helperText="Enter a valid email"
          errorMessage="Email is required"
        />
      );
      expect(screen.queryByText('Enter a valid email')).not.toBeInTheDocument();
    });

    it('should apply custom helper className', () => {
      const { container } = render(
        <Input helperText="Helper text" helperClassName="text-blue-500" />
      );
      const helper = screen.getByText('Helper text');
      expect(helper).toHaveClass('text-blue-500');
    });
  });

  describe('Size Variants', () => {
    it('should apply small size classes', () => {
      const { container } = render(<Input size="sm" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-8');
    });

    it('should apply default size classes', () => {
      const { container } = render(<Input size="default" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-10');
    });

    it('should apply large size classes', () => {
      const { container } = render(<Input size="lg" />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-12');
    });

    it('should use default size when not specified', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('h-10');
    });
  });

  describe('Icons', () => {
    it('should render left icon', () => {
      render(<Input leftIcon={<span data-testid="left-icon">🔍</span>} />);
      const icon = screen.getByTestId('left-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render right icon', () => {
      render(<Input rightIcon={<span data-testid="right-icon">✓</span>} />);
      const icon = screen.getByTestId('right-icon');
      expect(icon).toBeInTheDocument();
    });

    it('should render both icons', () => {
      render(
        <Input
          leftIcon={<span data-testid="left-icon">🔍</span>}
          rightIcon={<span data-testid="right-icon">✓</span>}
        />
      );
      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    it('should add padding to input with left icon', () => {
      const { container } = render(
        <Input leftIcon={<span data-testid="left-icon">🔍</span>} />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('pl-10');
    });

    it('should add padding to input with right icon', () => {
      const { container } = render(
        <Input rightIcon={<span data-testid="right-icon">✓</span>} />
      );
      const input = container.querySelector('input');
      expect(input).toHaveClass('pr-10');
    });
  });

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should have disabled styling', () => {
      const { container } = render(<Input disabled />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('disabled:opacity-50');
    });
  });

  describe('Input Types', () => {
    it('should support email type', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('should support password type', () => {
      const { container } = render(<Input type="password" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should support number type', () => {
      const { container } = render(<Input type="number" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('number');
    });

    it('should support search type', () => {
      const { container } = render(<Input type="search" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('search');
    });
  });

  describe('User Interactions', () => {
    it('should handle input changes', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await user.type(input, 'test value');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle focus events', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole('textbox');

      await user.click(input);

      expect(handleFocus).toHaveBeenCalled();
    });

    it('should handle blur events', async () => {
      const user = userEvent.setup();
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('ID Handling', () => {
    it('should use provided id', () => {
      render(<Input id="custom-id" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.id).toBe('custom-id');
    });

    it('should generate unique id if not provided', () => {
      const { container: container1 } = render(<Input label="First" />);
      const { container: container2 } = render(<Input label="Second" />);

      const input1 = container1.querySelector('input') as HTMLInputElement;
      const input2 = container2.querySelector('input') as HTMLInputElement;

      expect(input1.id).not.toBe(input2.id);
    });

    it('should associate label with generated id', () => {
      render(<Input label="Username" />);
      const label = screen.getByText('Username') as HTMLLabelElement;
      const input = screen.getByRole('textbox') as HTMLInputElement;

      expect(label.htmlFor).toBe(input.id);
    });
  });

  describe('Wrapper Styles', () => {
    it('should apply wrapper className', () => {
      const { container } = render(<Input wrapperClassName="max-w-md" />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveClass('max-w-md');
    });

    it('should have flex column layout', () => {
      const { container } = render(<Input />);
      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible focus styles', () => {
      const { container } = render(<Input />);
      const input = container.querySelector('input');
      expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });

    it('should support aria attributes', () => {
      render(<Input aria-label="Search input" aria-describedby="search-help" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Search input');
      expect(input).toHaveAttribute('aria-describedby', 'search-help');
    });

    it('should mark readonly inputs correctly', () => {
      render(<Input readOnly />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
    });

    it('should support step attribute', () => {
      const { container } = render(<Input type="number" step="0.01" />);
      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.step).toBe('0.01');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty label string', () => {
      const { container } = render(<Input label="" />);
      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });

    it('should handle multiple inputs on same page', () => {
      render(
        <>
          <Input label="Email" type="email" />
          <Input label="Password" type="password" />
        </>
      );

      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('should support defaultValue prop', () => {
      render(<Input defaultValue="Initial value" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('Initial value');
    });
  });
});
