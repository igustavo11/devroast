import type { ComponentProps } from 'react';
import { codeToHtml } from 'shiki';
import { twMerge } from 'tailwind-merge';

export function CodeBlockRoot({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className={twMerge(
        'border border-border-primary bg-bg-input font-mono text-[13px] overflow-hidden',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type CodeBlockHeaderProps = ComponentProps<'div'> & {
  filename?: string;
};

export function CodeBlockHeader({
  filename,
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div
      className={twMerge(
        'flex h-10 items-center gap-3 border-b border-border-primary px-4',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        <span className="size-[10px] rounded-full bg-accent-red" />
        <span className="size-[10px] rounded-full bg-accent-amber" />
        <span className="size-[10px] rounded-full bg-accent-green" />
      </div>
      {filename && (
        <span className="text-[12px] text-text-tertiary">{filename}</span>
      )}
    </div>
  );
}

type CodeBlockBodyProps = {
  code: string;
  lang?: string;
  className?: string;
};

export async function CodeBlockBody({
  code,
  lang = 'typescript',
  className,
}: CodeBlockBodyProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: 'vesper',
    transformers: [
      {
        pre(node) {
          node.properties.style = 'background:transparent;padding:0;margin:0;';
        },
      },
    ],
  });

  const lines = code.split('\n');

  return (
    <div className={twMerge('flex overflow-x-auto', className)}>
      {/* Line numbers */}
      <div
        aria-hidden
        className="flex flex-col gap-1.5 select-none border-r border-border-primary bg-bg-surface px-[10px] py-3 text-right text-[13px] text-text-tertiary"
      >
        {lines.map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: índices de linha são estáveis
          <div key={i} className="leading-none">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Code */}
      <div
        className="flex-1 p-3 leading-none [&_pre]:flex [&_pre]:flex-col [&_pre]:gap-1.5"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: output do shiki é confiável
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
