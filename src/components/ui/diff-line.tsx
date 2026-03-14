import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const diffLine = tv({
  base: 'flex items-start gap-2 px-4 py-2 font-mono text-[13px]',
  variants: {
    variant: {
      removed: 'bg-[#1A0A0A]',
      added: 'bg-[#0A1A0F]',
      context: 'bg-transparent',
    },
  },
  defaultVariants: {
    variant: 'context',
  },
});

const prefix = tv({
  base: 'select-none w-3 shrink-0',
  variants: {
    variant: {
      removed: 'text-accent-red',
      added: 'text-accent-green',
      context: 'text-text-tertiary',
    },
  },
  defaultVariants: {
    variant: 'context',
  },
});

const content = tv({
  base: 'flex-1 whitespace-pre',
  variants: {
    variant: {
      removed: 'text-text-secondary',
      added: 'text-text-primary',
      context: 'text-text-secondary',
    },
  },
  defaultVariants: {
    variant: 'context',
  },
});

const PREFIXES = {
  removed: '-',
  added: '+',
  context: ' ',
} as const;

type DiffLineProps = ComponentProps<'div'> &
  VariantProps<typeof diffLine> & {
    code: string;
  };

export function DiffLine({
  variant,
  code,
  className,
  ...props
}: DiffLineProps) {
  return (
    <div className={diffLine({ variant, className })} {...props}>
      <span className={prefix({ variant })}>
        {PREFIXES[variant ?? 'context']}
      </span>
      <span className={content({ variant })}>{code}</span>
    </div>
  );
}
