import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-white text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-white focus-visible:ring-offset-slate-900',
        secondary:
          'bg-slate-600 text-white hover:bg-slate-700 active:bg-slate-800 focus-visible:ring-white focus-visible:ring-offset-slate-900',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-white focus-visible:ring-offset-slate-900',
        outline:
          'border-2 border-white text-white bg-transparent hover:bg-white/10 active:bg-white/20 focus-visible:ring-white focus-visible:ring-offset-slate-900',
        ghost:
          'text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus-visible:ring-slate-900 focus-visible:ring-offset-white',
        link: 'text-slate-900 underline-offset-4 hover:underline focus-visible:ring-slate-900',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
