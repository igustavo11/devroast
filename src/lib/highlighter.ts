import type { HighlighterGeneric } from 'shiki';
import { createHighlighter as _createHighlighter } from 'shiki';
import { createCssVariablesTheme } from 'shiki/core';

// CSS variables theme — tokens resolved from globals.css :root vars
const devroastTheme = createCssVariablesTheme({
  name: 'devroast',
  variablePrefix: '--shiki-',
  variableDefaults: {},
  fontStyle: true,
});

type Highlighter = HighlighterGeneric<string, string>;

let _highlighter: Highlighter | null = null;
let _initPromise: Promise<Highlighter> | null = null;

/**
 * Returns a singleton Shiki highlighter instance.
 * Pre-loads JavaScript and TypeScript; all other languages are lazy-loaded on demand.
 */
export async function getHighlighter(): Promise<Highlighter> {
  if (_highlighter) return _highlighter;
  if (_initPromise) return _initPromise;

  _initPromise = _createHighlighter({
    themes: [devroastTheme],
    langs: ['javascript', 'typescript'],
  }).then((h) => {
    _highlighter = h as Highlighter;
    return _highlighter;
  });

  return _initPromise;
}

/**
 * Ensures a language grammar is loaded in the highlighter.
 * No-op if already loaded.
 */
export async function ensureLanguageLoaded(
  highlighter: Highlighter,
  langKey: string,
  langSrc: () => Promise<unknown>,
): Promise<void> {
  const loaded = highlighter.getLoadedLanguages();
  if (loaded.includes(langKey)) return;
  await highlighter.loadLanguage(
    langSrc as Parameters<typeof highlighter.loadLanguage>[0],
  );
}
