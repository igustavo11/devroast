# devroast — AGENTS.md

Global rules and patterns for AI agents working in this codebase.

---

## Project

**devroast** — paste your code, get a brutally honest AI review with a score from 0–10.

Stack: Next.js 16 · TypeScript · Tailwind CSS v4 · Biome v2

---

## File structure

```
src/
  app/
    globals.css          # @theme tokens — all design tokens live here
    layout.tsx           # NavbarRoot injected here (shared across all pages)
    page.tsx             # Homepage (code input + leaderboard preview)
    components/page.tsx  # Visual preview of all UI components
  components/ui/         # Design system — see AGENTS.md inside
```

---

## Code rules

- **Named exports only** — never `export default` for UI components
- **`tailwind-variants` (`tv()`)** for variant logic; **`twMerge`** only in components that don't use `tv()`
- **`import type`** for all type-only imports
- **No hardcoded hex colors** in Tailwind classes — use tokens (`bg-accent-green`, `text-text-primary`); exception: SVG `stroke`/`fill` use `var(--color-*)` directly
- **Composition pattern** for multi-part components: `CardRoot`, `CardTitle`, `CardDescription` — not props `title` and `description`
- Font: **JetBrains Mono** everywhere (`font-mono`) — no IBM Plex Mono

---

## Design tokens (globals.css `@theme`)

| Token | Value |
|---|---|
| `--color-bg-page` | `#0A0A0A` |
| `--color-bg-surface` | `#0F0F0F` |
| `--color-bg-elevated` | `#1A1A1A` |
| `--color-bg-input` | `#111111` |
| `--color-border-primary` | `#2A2A2A` |
| `--color-border-focus` | `#10B981` |
| `--color-text-primary` | `#FAFAFA` |
| `--color-text-secondary` | `#6B7280` |
| `--color-text-tertiary` | `#4B5563` |
| `--color-accent-green` | `#10B981` |
| `--color-accent-red` | `#EF4444` |
| `--color-accent-amber` | `#F59E0B` |
| `--color-accent-cyan` | `#06B6D4` |

---

## UI components

See `src/components/ui/AGENTS.md` for component-level patterns.

Key multi-part components:

| Component | Sub-components |
|---|---|
| `navbar` | `NavbarRoot`, `NavbarLogo`, `NavbarNav` |
| `card` | `CardRoot`, `CardBadge`, `CardTitle`, `CardDescription` |
| `code-block` | `CodeBlockRoot`, `CodeBlockHeader`, `CodeBlockBody` (async) |
| `table-row` | `TableRowRoot`, `TableRowRank`, `TableRowScore`, `TableRowCode`, `TableRowLang` |

Atomic (no composition needed): `Button`, `Badge`, `Toggle`, `DiffLine`, `ScoreRing`
