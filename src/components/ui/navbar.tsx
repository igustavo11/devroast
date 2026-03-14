import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export function NavbarRoot({
  className,
  children,
  ...props
}: ComponentProps<'nav'>) {
  return (
    <nav
      className={twMerge(
        'flex h-14 items-center px-10',
        'bg-bg-page border-b border-border-primary',
        'font-mono',
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

export function NavbarLogo({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className={twMerge('flex items-center gap-2', className)} {...props}>
      <span className="text-[20px] font-bold text-accent-green leading-none">
        &gt;
      </span>
      <span className="text-[18px] font-medium text-text-primary leading-none">
        {children}
      </span>
    </div>
  );
}

export function NavbarNav({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <>
      <div className="flex-1" />
      <div className={twMerge('flex items-center gap-6', className)} {...props}>
        {children}
      </div>
    </>
  );
}
