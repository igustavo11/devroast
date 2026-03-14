'use client';

import { Switch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ToggleProps = Omit<ComponentProps<typeof Switch.Root>, 'className'> & {
  className?: string;
};

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <Switch.Root
      className={twMerge(
        'relative inline-flex h-[22px] w-[40px] cursor-pointer rounded-[11px]',
        'bg-border-primary transition-colors',
        'data-[checked]:bg-accent-green',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <Switch.Thumb className="pointer-events-none block size-4 rounded-full shadow-sm bg-text-secondary transition-all translate-x-[3px] data-[checked]:translate-x-[21px] data-[checked]:bg-bg-page" />
    </Switch.Root>
  );
}
