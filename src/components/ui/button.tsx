import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
  base: [
    'inline-flex items-center justify-center gap-2',
    'font-mono font-medium text-[13px]',
    'cursor-pointer transition-colors',
    'disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page',
  ],
  variants: {
    variant: {
      primary: [
        'bg-accent-green text-bg-page',
        'hover:bg-accent-green/80',
        'focus-visible:ring-accent-green',
      ],
      secondary: [
        'bg-bg-elevated text-text-primary',
        'hover:bg-bg-elevated/70',
        'focus-visible:ring-border-primary',
      ],
      outline: [
        'border border-accent-green text-accent-green bg-transparent',
        'hover:bg-accent-green/10',
        'focus-visible:ring-accent-green',
      ],
      ghost: [
        'bg-transparent text-text-secondary',
        'hover:bg-bg-elevated hover:text-text-primary',
        'focus-visible:ring-border-primary',
      ],
      destructive: [
        'bg-accent-red text-white',
        'hover:bg-accent-red/80',
        'focus-visible:ring-accent-red',
      ],
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-6 py-2.5 text-[13px]',
      lg: 'px-8 py-3 text-sm',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>;

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}
