import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

export function TableRowRoot({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'flex items-center gap-6 px-5 py-4 border-b border-border-primary font-mono',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TableRowRank({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={twMerge('w-10 shrink-0', className)} {...props}>
      <span className="text-[13px] text-text-tertiary">{children}</span>
    </div>
  );
}

const scoreText = tv({
  base: 'text-[13px] font-bold',
  variants: {
    level: {
      bad: 'text-accent-red',
      mid: 'text-accent-amber',
      good: 'text-accent-green',
    },
  },
  defaultVariants: {
    level: 'bad',
  },
});

function scoreLevel(score: number): VariantProps<typeof scoreText>['level'] {
  if (score <= 4) return 'bad';
  if (score <= 6) return 'mid';
  return 'good';
}

type TableRowScoreProps = ComponentProps<'div'> & { value: number };

export function TableRowScore({
  value,
  className,
  ...props
}: TableRowScoreProps) {
  return (
    <div className={twMerge('w-[60px] shrink-0', className)} {...props}>
      <span className={scoreText({ level: scoreLevel(value) })}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export function TableRowCode({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={twMerge('flex-1 overflow-hidden', className)} {...props}>
      <span className="block truncate text-[12px] text-text-secondary">
        {children}
      </span>
    </div>
  );
}

export function TableRowLang({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge('w-[100px] shrink-0 text-right', className)}
      {...props}
    >
      <span className="text-[12px] text-text-tertiary">{children}</span>
    </div>
  );
}
