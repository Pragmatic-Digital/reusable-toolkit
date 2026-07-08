import React, { InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

/**
 * Input component size variants
 */
const inputVariants = cva(
  'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-base font-medium ring-offset-white transition-all placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-8 px-2 py-1 text-sm',
        default: 'h-10 px-3 py-2 text-base',
        lg: 'h-12 px-4 py-3 text-lg',
      },
      variant: {
        default: 'border-slate-200 focus-visible:ring-slate-950 focus-visible:ring-offset-white',
        error: 'border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-white',
        success: 'border-green-500 focus-visible:ring-green-500 focus-visible:ring-offset-white',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

/**
 * Props for Input component
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  /** Optional error message to display below input */
  errorMessage?: string;
  /** Optional helper text to display below input */
  helperText?: string;
  /** Optional label for the input */
  label?: string;
  /** Whether to show required indicator */
  required?: boolean;
  /** Optional icon element to display inside input on the left */
  leftIcon?: React.ReactNode;
  /** Optional icon element to display inside input on the right */
  rightIcon?: React.ReactNode;
  /** Additional CSS class for wrapper div */
  wrapperClassName?: string;
  /** Additional CSS class for label */
  labelClassName?: string;
  /** Additional CSS class for helper text */
  helperClassName?: string;
  /** Additional CSS class for error message */
  errorClassName?: string;
}

/**
 * Input Component
 *
 * A flexible, accessible form input component with support for various states,
 * sizes, and optional icons, labels, and help text.
 *
 * Supports all standard HTML input attributes (type, placeholder, disabled, etc.)
 * and adds additional features like error states, helper text, and icons.
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   placeholder="Enter your email"
 *   label="Email Address"
 *   required
 *   errorMessage="Please enter a valid email"
 * />
 *
 * <Input
 *   type="text"
 *   placeholder="Search..."
 *   leftIcon={<SearchIcon />}
 *   size="lg"
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      labelClassName,
      helperClassName,
      errorClassName,
      size,
      variant,
      errorMessage,
      helperText,
      label,
      required,
      leftIcon,
      rightIcon,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    // Generate unique id if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine variant based on error state
    const displayVariant = errorMessage ? 'error' : variant;

    return (
      <div className={clsx('flex flex-col gap-1.5 w-full', wrapperClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={clsx(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-950',
              required && "after:content-['*'] after:ml-0.5 after:text-red-500",
              labelClassName,
            )}
          >
            {label}
          </label>
        )}

        {/* Input Wrapper with Icons */}
        <div className="relative flex w-full items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={clsx(
              inputVariants({ size, variant: displayVariant }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-0 pr-3 flex items-center pointer-events-none text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message or Helper Text */}
        {errorMessage ? (
          <p
            className={clsx(
              'text-sm font-medium text-red-500 leading-none',
              errorClassName,
            )}
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </p>
        ) : helperText ? (
          <p
            className={clsx(
              'text-sm font-medium text-slate-600 leading-none',
              helperClassName,
            )}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
