'use client';

import { Select } from '@base-ui/react/select';
import type { ComponentProps } from 'react';
import { LANGUAGES } from '@/lib/languages';

type LanguageSelectProps = Omit<
  ComponentProps<typeof Select.Root>,
  'value' | 'onValueChange'
> & {
  /** null = Auto mode (uses detected language) */
  value: string | null;
  /** The language currently detected automatically */
  detectedLanguage: string;
  /** Called with null to reset to Auto, or a key from LANGUAGES */
  onValueChange: (lang: string | null) => void;
};

function CheckIcon() {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M1 4L3.5 6.5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const itemClass = [
  'flex items-center gap-2 px-3 py-1.5 cursor-pointer',
  'text-text-secondary hover:text-text-primary hover:bg-bg-input',
  'outline-none focus-visible:bg-bg-input focus-visible:text-text-primary',
  'data-[selected]:text-accent-green',
  'transition-colors',
].join(' ');

export function LanguageSelect({
  value,
  detectedLanguage,
  onValueChange,
  ...props
}: LanguageSelectProps) {
  const isAuto = value === null;
  const detectedLabel = LANGUAGES[detectedLanguage]?.label ?? detectedLanguage;

  function handleValueChange(v: unknown) {
    onValueChange(v === '__auto__' ? null : (v as string));
  }

  const triggerLabel = isAuto
    ? `Auto · ${detectedLabel}`
    : (LANGUAGES[value]?.label ?? value);

  return (
    <Select.Root
      value={isAuto ? '__auto__' : value}
      onValueChange={handleValueChange}
      {...props}
    >
      <Select.Trigger
        className={[
          'flex items-center gap-1.5 px-2 py-0.5',
          'font-mono text-[11px] text-text-secondary',
          'border border-transparent rounded-sm',
          'hover:border-border-primary hover:text-text-primary',
          'focus-visible:outline-none focus-visible:border-border-focus focus-visible:text-text-primary',
          'transition-colors cursor-pointer select-none',
          'data-[popup-open]:border-border-primary data-[popup-open]:text-text-primary',
        ].join(' ')}
        aria-label="Select language"
      >
        <Select.Value>{triggerLabel}</Select.Value>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          role="presentation"
          aria-hidden="true"
          focusable="false"
          className="opacity-50 shrink-0"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner sideOffset={4} align="end">
          <Select.Popup
            className={[
              'min-w-[160px] max-h-[280px] overflow-y-auto',
              'bg-bg-elevated border border-border-primary',
              'py-1 z-50',
              'font-mono text-[12px]',
              'shadow-lg shadow-black/40',
            ].join(' ')}
          >
            {/* Auto option */}
            <Select.Item value="__auto__" className={itemClass}>
              <Select.ItemIndicator className="w-3 shrink-0">
                <CheckIcon />
              </Select.ItemIndicator>
              <Select.ItemText>Auto</Select.ItemText>
            </Select.Item>

            {/* Divider */}
            <div className="mx-3 my-1 border-t border-border-primary" />

            {/* Language list (plaintext last) */}
            {Object.entries(LANGUAGES)
              .filter(([key]) => key !== 'plaintext')
              .map(([key, lang]) => (
                <Select.Item key={key} value={key} className={itemClass}>
                  <Select.ItemIndicator className="w-3 shrink-0">
                    <CheckIcon />
                  </Select.ItemIndicator>
                  <Select.ItemText>{lang.label}</Select.ItemText>
                </Select.Item>
              ))}

            <Select.Item value="plaintext" className={itemClass}>
              <Select.ItemIndicator className="w-3 shrink-0">
                <CheckIcon />
              </Select.ItemIndicator>
              <Select.ItemText>Plaintext</Select.ItemText>
            </Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
