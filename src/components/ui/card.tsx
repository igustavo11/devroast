import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Badge } from './badge';

const cardRoot = tv({
  base: 'flex flex-col gap-3 border border-border-primary bg-bg-surface p-5',
});

type CardVariant = 'critical' | 'warning' | 'good';

type CardRootProps = ComponentProps<'div'> & {
  variant?: CardVariant;
};

export function CardRoot({ variant = 'critical', className, children, ...props }: CardRootProps) {
  return (
    <div className={cardRoot({ className })} data-variant={variant} {...props}>
      {children}
    </div>
  );
}

type CardBadgeProps = ComponentProps<'span'> & {
  variant?: CardVariant;
};

export function CardBadge({ variant = 'critical', ...props }: CardBadgeProps) {
  return <Badge variant={variant} label={variant} {...props} />;
}

export function CardTitle({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p className={tv({ base: 'font-mono text-[13px] text-text-primary' })({ className })} {...props}>
      {children}
    </p>
  );
}

export function CardDescription({ className, children, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={tv({ base: 'font-mono text-[12px] text-text-secondary leading-[1.5]' })({ className })}
      {...props}
    >
      {children}
    </p>
  );
}
