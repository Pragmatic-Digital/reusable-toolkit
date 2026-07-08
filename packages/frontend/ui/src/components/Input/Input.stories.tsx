import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Input } from './Input';

/**
 * Input component for capturing user text input.
 *
 * Features:
 * - Multiple sizes (sm, default, lg)
 * - Error and success states
 * - Optional label, helper text, and error messages
 * - Support for left and right icons
 * - Full accessibility with ARIA support
 * - Keyboard navigation
 *
 * @component
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible, accessible form input component supporting various states, sizes, and optional icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the input field',
    },
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the input (error state overrides variant)',
    },
    type: {
      control: 'text',
      description: 'HTML input type attribute',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text inside input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required (shows indicator)',
    },
    label: {
      control: 'text',
      description: 'Label text displayed above input',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message (takes precedence over helper text)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default input with no additional configuration
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text',
  },
};

/**
 * Input with label
 */
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
  },
};

/**
 * Required input with label
 */
export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    required: true,
  },
};

/**
 * Input with helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
    helperText: 'We will never share your email with anyone else',
  },
};

/**
 * Input with error message
 */
export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'you@example.com',
    type: 'email',
    errorMessage: 'Please enter a valid email address',
  },
};

/**
 * Disabled input
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
  },
};

/**
 * Small input
 */
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
    label: 'Small',
  },
};

/**
 * Large input
 */
export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
    label: 'Large',
  },
};

/**
 * Input with left icon (search)
 */
export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
};

/**
 * Input with right icon (check)
 */
export const WithRightIcon: Story = {
  args: {
    label: 'Confirmed',
    placeholder: 'Your email',
    rightIcon: (
      <svg
        className="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

/**
 * Input with both left and right icons
 */
export const WithBothIcons: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    leftIcon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    rightIcon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
          fillRule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

/**
 * Email input
 */
export const Email: Story = {
  args: {
    type: 'email',
    label: 'Email Address',
    placeholder: 'you@example.com',
    helperText: 'We will send a confirmation email',
  },
};

/**
 * Password input
 */
export const Password: Story = {
  args: {
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true,
  },
};

/**
 * Number input with controls
 */
export const Number: Story = {
  args: {
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter quantity',
    min: 1,
    max: 100,
    step: 1,
  },
};

/**
 * Search input
 */
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search products...',
    label: 'Search',
    leftIcon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
};

/**
 * Date input
 */
export const Date: Story = {
  args: {
    type: 'date',
    label: 'Date of Birth',
  },
};

/**
 * Time input
 */
export const Time: Story = {
  args: {
    type: 'time',
    label: 'Meeting Time',
  },
};

/**
 * Readonly input
 */
export const ReadOnly: Story = {
  args: {
    label: 'Order Number',
    value: 'ORD-2025-001',
    readOnly: true,
  },
};

/**
 * Success state input
 */
export const Success: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    value: 'user@example.com',
    variant: 'success',
    rightIcon: (
      <svg
        className="w-4 h-4 text-green-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

/**
 * Complete form example with multiple inputs
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
      />
      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        required
        helperText="We will send a confirmation email"
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+1 (555) 000-0000"
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter a strong password"
        required
      />
    </div>
  ),
};

/**
 * Accessibility-focused example
 */
export const Accessible: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Input
        id="email-input"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        aria-label="Enter your email address"
        aria-describedby="email-help"
        required
      />
      <p id="email-help" className="text-sm text-slate-600">
        We use this to send you important updates
      </p>
    </div>
  ),
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Input size="sm" placeholder="Small input" label="Small" />
      <Input size="default" placeholder="Default input" label="Default" />
      <Input size="lg" placeholder="Large input" label="Large" />
    </div>
  ),
};

/**
 * All states comparison
 */
export const AllStates: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      <Input label="Default" placeholder="Enter text" />
      <Input label="Disabled" placeholder="Disabled" disabled />
      <Input
        label="With Helper"
        placeholder="Enter text"
        helperText="This is helper text"
      />
      <Input
        label="With Error"
        placeholder="Enter text"
        errorMessage="This field is required"
      />
      <Input
        label="Success"
        placeholder="Confirmed"
        variant="success"
        value="user@example.com"
        readOnly
      />
    </div>
  ),
};
