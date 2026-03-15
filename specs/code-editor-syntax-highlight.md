# Spec: Code Editor com Syntax Highlighting

**Feature:** Editor de código com syntax highlighting automático na homepage  
**Status:** Em especificação  
**Data:** 2026-03-15

---

## Sumário executivo

O objetivo é substituir o `<textarea>` atual da homepage por um editor com syntax highlighting real, onde as cores são aplicadas automaticamente conforme a linguagem detectada no código colado pelo usuário. O usuário também pode selecionar a linguagem manualmente via um seletor no editor.

---

## Pesquisa de alternativas

### 1. Abordagem ray.so — Shiki (render) + highlight.js (detecção)

**Repositório analisado:** https://github.com/raycast/ray-so

O ray.so usa uma arquitetura de duas camadas:

- **Editor:** `<textarea>` customizado com overlay. Nenhuma lib de editor externa (sem CodeMirror, Monaco, Ace). A textarea tem `color: transparent` e `caret-color` visível; abaixo dela, o HTML gerado pelo Shiki é renderizado.
- **Syntax highlighting:** [Shiki v1](https://shiki.style/) via `getHighlighterCore` com runtime WebAssembly (`shiki/wasm`). Grammars carregadas sob demanda (lazy import por linguagem).
- **Detecção de linguagem:** `hljs.highlightAuto()` do [highlight.js](https://highlightjs.org/) chamado a cada keystroke, passando as linguagens suportadas como hint list. Resultado alimenta um atom de linguagem detectada.
- **Temas:** Sistema de CSS variables custom (`--ray-token-*`) — a troca de tema é apenas CSS, sem re-highlight.
- **State:** Jotai atoms + URL hash persistence.

**Veredito:** Arquitetura sólida e battle-tested. A separação Shiki (render) + hljs (detecção) é um padrão inteligente. O problema é que o projeto **já tem Shiki `^4.0.2`** instalado, mas o ray.so usa `^1.0.0` — a API de Shiki v4 difere da v1 (o `getHighlighterCore` pode ter mudado). A abordagem da textarea overlay é simples e funciona bem para o caso de uso do devroast.

---

### 2. CodeMirror 6

**Site:** https://codemirror.net/

Editor full-featured modular. Usado pelo Replit, Codesandbox, e outros.

- **Prós:** Edição rica (undo/redo avançado, bracket matching, fold), extensível, syntax highlight nativo via `@codemirror/language` + Lezer grammars, detecção automática via `StreamLanguage`, grande ecossistema.
- **Contras:** Bundle pesado (~150KB+ gzip dependendo das linguagens carregadas). Overhead desnecessário para um campo de paste — o devroast não é uma IDE. A UX de "paste code, get roasted" não precisa de undo/redo avançado ou autocompletion.

**Veredito:** Overkill para este caso de uso.

---

### 3. Monaco Editor

**Site:** https://microsoft.github.io/monaco-editor/

O editor do VS Code. Usado pelo StackBlitz, CodeSandbox.

- **Prós:** Experiência completa de IDE, IntelliSense, syntax highlight excelente.
- **Contras:** Bundle **muito** pesado (~2MB+). Não funciona em SSR/Next.js sem configuração complexa. Completamente desnecessário para um campo de paste simples.

**Veredito:** Inadequado para este projeto.

---

### 4. Shiki sozinho (sem biblioteca de editor)

Shiki é um highlighter baseado em TextMate grammars (as mesmas do VS Code). Gera HTML estático com as cores aplicadas diretamente nos tokens via `<span>` com classes ou inline styles.

- **Prós:** Já está no projeto (`shiki ^4.0.2`). Output HTML de alta qualidade. Zero runtime JS para re-highlight (pode rodar server-side). Suporte a ~200 linguagens.
- **Contras:** Não tem detecção de linguagem nativa — precisa de uma lib separada para isso.

**Veredito:** A peça central da solução. Já instalado.

---

### 5. highlight.js (para detecção automática)

- `hljs.highlightAuto(code)` analisa o código e retorna a linguagem mais provável.
- Leve para o que faz, já battle-tested no ray.so para esse fim específico.
- **Alternativa:** `linguist` ou heurísticas manuais — porém hljs é o padrão mais usado para detecção client-side.

---

## Decisão arquitetural

**Usar a mesma estratégia do ray.so, adaptada ao stack do devroast:**

| Camada | Solução | Justificativa |
|---|---|---|
| Editor (input) | `<textarea>` overlay customizada | Simples, zero dependência nova, padrão comprovado |
| Syntax highlight | **Shiki v4** (`codeToHtml` / `codeToTokens`) | Já instalado, output de altíssima qualidade, mesmas grammars do VS Code |
| Detecção de linguagem | **highlight.js** (`highlightAuto`) | Excelente para detecção, leve, bem documentado, mesmo padrão do ray.so |
| Seletor manual de linguagem | Componente `Select` / `Combobox` customizado | `@base-ui/react` já disponível no projeto |
| Estado | `useState` local (homepage é `'use client'`) | Consistente com o estado atual da página |

**Por que não CodeMirror/Monaco?** O devroast é uma ferramenta de _paste & roast_, não uma IDE. O overhead de bundle e complexidade não se justifica.

**Por que Shiki e não hljs para render?** A qualidade do output do Shiki é muito superior — usa as mesmas grammars do VS Code. hljs tem highlighting mais limitado. A estratégia de usar hljs apenas para _detecção_ e Shiki para _renderização_ é o melhor dos dois mundos.

---

## Análise do estado atual do projeto

A homepage (`src/app/page.tsx`) já tem:
- Uma `<textarea>` dentro de um fake terminal window (780×360px)
- Numeração de linhas dinâmica no gutter esquerdo
- Estado local `code` (string) e `roastMode` (boolean)
- Shiki `^4.0.2` já instalado

O que **não existe ainda:**
- Syntax highlighting aplicado ao conteúdo da textarea
- Detecção automática de linguagem
- Seletor manual de linguagem

---

## Especificação de implementação

### Componentes a criar

#### `src/components/ui/code-editor.tsx`

Componente central da feature. Implementa o padrão textarea overlay.

**Sub-componentes (composition pattern):**
- `CodeEditorRoot` — container com `display: grid`, gerencia estado interno
- `CodeEditorHeader` — barra superior com dots decorativos + seletor de linguagem
- `CodeEditorGutter` — coluna de números de linha
- `CodeEditorBody` — área com a textarea (transparente) + highlight layer (Shiki HTML)

**Props de `CodeEditorRoot`:**
```typescript
type CodeEditorRootProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}
```

**Comportamento interno:**
- Mantém `detectedLanguage` e `selectedLanguage` (null = auto)
- `selectedLanguage ?? detectedLanguage` determina a linguagem ativa
- Re-detecta a cada mudança de `value` (debounce de ~300ms para evitar detecção em cada keystroke)
- Lazy-load das grammars Shiki por linguagem

#### `src/components/ui/language-select.tsx`

Seletor de linguagem para o header do editor.

- Opção "Auto" no topo (padrão)
- Lista das linguagens suportadas
- Mostra a linguagem detectada automaticamente quando "Auto" está selecionado (ex: `Auto · JavaScript`)
- Construído sobre `@base-ui/react` (Select ou Popover + lista)
- Segue os design tokens do projeto

### Linguagens a suportar (fase 1)

Priorizar as mais comuns para o público dev:

```
javascript, typescript, tsx, jsx, python, rust, go,
java, kotlin, swift, c, cpp, csharp, php, ruby,
bash, shell, sql, html, css, json, yaml, markdown,
plaintext
```

~24 linguagens. Grammars carregadas via dynamic import do pacote `shiki`.

### Integração na homepage

Substituir o bloco atual da textarea + gutter por `<CodeEditorRoot>`:

```tsx
// Antes (atual)
<div className="...gutter...">
  {lineNumbers.map(n => <span key={n}>{n}</span>)}
</div>
<textarea value={code} onChange={...} />

// Depois
<CodeEditorRoot value={code} onChange={setCode} />
```

### Shiki v4 — API relevante

A versão instalada (`^4.0.2`) usa a API moderna:

```typescript
// Inicialização (singleton, fora do componente)
import { createHighlighter } from 'shiki'

const highlighter = await createHighlighter({
  themes: ['github-dark'],  // ou tema custom via CSS vars
  langs: ['javascript'],    // langs iniciais; resto é lazy-load
})

// Render
const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  theme: 'github-dark',
})
```

**Nota:** Shiki v4 tem `createHighlighter` em vez de `getHighlighterCore` (que era da v1 usada pelo ray.so). Verificar a API exata na documentação antes de implementar.

### Tema visual

O devroast usa fundo `#0A0A0A` (bg-page) e `#111111` (bg-input). O tema Shiki deve ser configurado com CSS variables mapeadas para os tokens de design do projeto:

```css
/* globals.css — adicionar */
--shiki-foreground: var(--color-text-primary);
--shiki-background: transparent;
--shiki-token-keyword: var(--color-accent-cyan);
--shiki-token-string: var(--color-accent-amber);
--shiki-token-function: var(--color-accent-green);
--shiki-token-comment: var(--color-text-tertiary);
--shiki-token-number: var(--color-accent-red);
--shiki-token-operator: var(--color-text-secondary);
--shiki-token-punctuation: var(--color-text-secondary);
```

Usar `createCssVariablesTheme` do Shiki (disponível na v4) para criar um tema baseado nessas variáveis.

### Detecção de linguagem

```typescript
import hljs from 'highlight.js'

// Debounced, chamado quando o usuário para de digitar
const detect = (code: string): string => {
  const result = hljs.highlightAuto(code, SUPPORTED_LANGUAGES)
  return result.language ?? 'plaintext'
}
```

A detecção roda **client-side** com debounce de 300ms.

### UX — estados do seletor de linguagem

| Estado | Display no seletor |
|---|---|
| Auto-detect ativo | `Auto · JavaScript` (linguagem detectada entre `·`) |
| Usuário selecionou manualmente | `JavaScript` (sem prefixo "Auto") |
| Detectando... | `Auto · ...` |
| Código muito curto para detectar | `Auto · Plaintext` |

---

## Dependências a instalar

| Pacote | Motivo |
|---|---|
| `highlight.js` | Detecção automática de linguagem |

Shiki já está instalado. `@base-ui/react` já está disponível via `@base-ui/react`.

---

## To-dos de implementação

- [ ] **SETUP-1** — Instalar `highlight.js` e verificar API do Shiki v4 (`createHighlighter`, `createCssVariablesTheme`)
- [ ] **SETUP-2** — Definir lista final de linguagens suportadas e seus imports de grammar (`shiki/langs/*.mjs`)
- [ ] **THEME-1** — Criar mapeamento de CSS variables para tokens Shiki em `globals.css`
- [ ] **THEME-2** — Instanciar `createCssVariablesTheme` e testar output visual com o tema do devroast
- [ ] **EDITOR-1** — Criar `src/components/ui/code-editor.tsx` com `CodeEditorRoot`, `CodeEditorHeader`, `CodeEditorGutter`, `CodeEditorBody`
- [ ] **EDITOR-2** — Implementar o padrão textarea overlay (textarea transparente + Shiki HTML abaixo)
- [ ] **EDITOR-3** — Implementar numeração de linhas sincronizada com o conteúdo e scroll
- [ ] **EDITOR-4** — Tratar Tab key (inserir 2 espaços, não mudar o foco)
- [ ] **DETECT-1** — Criar utility `src/lib/detect-language.ts` com detecção via `hljs.highlightAuto` e debounce
- [ ] **DETECT-2** — Integrar detecção automática no `CodeEditorRoot` (estado `detectedLanguage`)
- [ ] **SELECT-1** — Criar `src/components/ui/language-select.tsx` com listagem das linguagens e opção "Auto"
- [ ] **SELECT-2** — Exibir linguagem detectada no seletor quando modo Auto está ativo (`Auto · JavaScript`)
- [ ] **SELECT-3** — Permitir override manual pelo usuário (reseta para Auto quando o código é apagado — a definir)
- [ ] **LAZY-1** — Implementar lazy-load das grammars Shiki por linguagem (carregar apenas quando selecionada/detectada)
- [ ] **HOMEPAGE-1** — Integrar `CodeEditorRoot` na `src/app/page.tsx` substituindo o bloco atual
- [ ] **HOMEPAGE-2** — Garantir que o estado `code` da página continua fluindo corretamente para o botão de roast
- [ ] **A11Y-1** — Adicionar `aria-label` adequado na textarea e `aria-live` para anunciar mudança de linguagem detectada
- [ ] **PERF-1** — Medir impacto no bundle (highlight.js tree-shaking, Shiki WASM)
- [ ] **PREVIEW-1** — Adicionar a feature na página `/components` para visualização isolada

---

## Perguntas em aberto

> Estas perguntas precisam de resposta antes da implementação.

1. **Tema Shiki:** Prefere um tema escuro padrão pronto (ex: `github-dark`, `one-dark-pro`) como fallback inicial, ou quer construir o tema customizado com as CSS variables do devroast desde o início?

2. **Reset de linguagem:** Quando o usuário seleciona uma linguagem manualmente e depois apaga todo o código, o seletor deve voltar para "Auto" ou manter a seleção manual?

3. **Linguagens suportadas:** A lista de ~24 linguagens proposta acima é suficiente para o lançamento, ou há linguagens específicas que devem ser priorizadas/adicionadas?

4. **Comportamento do Tab:** Ao pressionar Tab dentro do editor, inserir 2 espaços (padrão Python/JS) ou 4 espaços?

5. **Scroll sincronizado:** O highlight layer precisa rolar junto com a textarea. Isso é trivial com `overflow: hidden` no highlight layer e deixando apenas a textarea com scroll — confirmar se este comportamento é desejado ou se o editor deve ter altura fixa com scroll interno.

---

## Referências

- [Shiki v4 docs](https://shiki.style/)
- [ray.so — Editor.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/Editor.tsx)
- [ray.so — HighlightedCode.tsx](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/components/HighlightedCode.tsx)
- [ray.so — store/code.ts (hljs detect)](https://github.com/raycast/ray-so/blob/main/app/(navigation)/(code)/store/code.ts)
- [highlight.js — highlightAuto](https://highlightjs.readthedocs.io/en/latest/api.html#highlightauto)
- [Shiki — createCssVariablesTheme](https://shiki.style/guide/theme#css-variables-theme)
