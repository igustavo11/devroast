import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badge = tv({
  base: 'inline-flex items-center gap-2 font-mono text-xs font-normal',
  variants: {
    variant: {
      critical: 'text-accent-red',
      warning: 'text-accent-amber',
      good: 'text-accent-green',
      verdict: 'text-accent-red',
    },
  },
  defaultVariants: {
    variant: 'good',
  },
});

const dot = tv({
  base: 'size-2 rounded-full shrink-0',
  variants: {
    variant: {
      critical: 'bg-accent-red',
      warning: 'bg-accent-amber',
      good: 'bg-accent-green',
      verdict: 'bg-accent-red',
    },
  },
  defaultVariants: {
    variant: 'good',
  },
});

type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badge> & {
    label: string;
  };

export function Badge({ variant, label, className, ...props }: BadgeProps) {
  return (
    <span className={badge({ variant, className })} {...props}>
      <span className={dot({ variant })} />
      {label}
    </span>
  );
}
