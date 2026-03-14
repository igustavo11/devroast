# UI Components — Padrões de Criação

Este documento define os padrões que **todos** os componentes em `src/components/ui/` devem seguir.

---

## Regras obrigatórias

### 1. Somente named exports — nunca default exports

```tsx
// correto
export function Button({ ... }: ButtonProps) {}

// errado
export default function Button({ ... }: ButtonProps) {}
```

### 2. Usar `tailwind-variants` (`tv`) para variantes

Toda lógica de variação de estilo deve ser feita com `tv()`. Não usar `clsx`, `cn` ou concatenações manuais de strings de classe.

```tsx
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
  base: ['...classes base...'],
  variants: {
    variant: {
      primary: '...',
      secondary: '...',
    },
    size: {
      sm: '...',
      md: '...',
      lg: '...',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### 3. Passar `className` diretamente para `tv()` — nunca usar `twMerge` separado

O `tailwind-variants` já resolve conflitos de classes internamente. Passe `className` como propriedade diretamente na chamada da função gerada pelo `tv()`.

```tsx
// correto — tv faz o merge automaticamente
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}

// errado — twMerge é desnecessário aqui
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={twMerge(button({ variant, size }), className)} {...props} />;
}
```

### 4. Estender as props nativas do elemento HTML correspondente

Usar `ComponentProps<'elemento'>` para herdar todos os atributos nativos do HTML, garantindo acessibilidade e flexibilidade total.

```tsx
import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>;
```

### 5. Usar `import type` para tipos

```tsx
// correto
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

// errado
import { ComponentProps } from 'react';
```

### 6. Não importar `twMerge`

`tailwind-merge` **não deve ser importado** nos componentes de UI. O `tailwind-variants` já inclui merge de classes por padrão.

---

## Estrutura de um componente

```tsx
import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const component = tv({
  base: ['...classes base compartilhadas...'],
  variants: {
    variant: {
      primary: '...',
    },
    size: {
      md: '...',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

type ComponentProps = ComponentProps<'elemento'> & VariantProps<typeof component>;

export function Component({ variant, size, className, ...props }: ComponentProps) {
  return <elemento className={component({ variant, size, className })} {...props} />;
}
```

---

## Componentes com comportamento — Base UI

Para componentes interativos (toggle, slider, select, etc.) usar `@base-ui/react` em vez de implementar a lógica manualmente.

- Adicionar `'use client'` no topo do arquivo (Base UI requer runtime do cliente)
- Estilizar via classes Tailwind + data attributes (`data-[checked]`, `data-[open]`, etc.)
- Tipar props via `ComponentProps<typeof Component.Root>` (não `ComponentProps<'button'>`)

```tsx
'use client';

import { Switch } from '@base-ui/react/switch';
import type { ComponentProps } from 'react';

type ToggleProps = ComponentProps<typeof Switch.Root>;

export function Toggle({ className, ...props }: ToggleProps) {
  return (
    <Switch.Root className={['...', className].filter(Boolean).join(' ')} {...props}>
      <Switch.Thumb className="... data-[checked]:translate-x-[21px]" />
    </Switch.Root>
  );
}
```

---

## Server Components com async — CodeBlock / Shiki

Componentes que fazem operações assíncronas (ex: highlight de código com Shiki) devem ser Server Components:

- **Não** adicionar `'use client'`
- A função deve ser `async`
- Não usar hooks React (`useState`, `useEffect`, etc.)

```tsx
import { codeToHtml } from 'shiki';

type CodeBlockProps = { code: string; lang?: string };

export async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const html = await codeToHtml(code, { lang, theme: 'vesper' });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

---

## Página de referência visual

Todos os componentes de UI devem ter suas variantes exibidas em `src/app/components/page.tsx`.

Ao criar um novo componente, adicione uma seção na página com:
- Nome do componente
- Todas as variantes de `variant`
- Todas as variantes de `size`
- Estado `disabled`
