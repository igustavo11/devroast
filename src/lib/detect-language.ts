import hljs from 'highlight.js';
import { HLJS_ALIAS_MAP, LANGUAGE_KEYS } from './languages';

/**
 * Detects the programming language of a given code snippet.
 * Uses highlight.js highlightAuto, scoped to the languages we support.
 * Returns 'plaintext' for short/empty input or when detection fails.
 */
export function detectLanguage(code: string): string {
  if (code.trim().length < 20) return 'plaintext';

  const result = hljs.highlightAuto(code, LANGUAGE_KEYS);
  const detected = result.language ?? 'plaintext';

  // Normalize hljs aliases to our language keys
  return HLJS_ALIAS_MAP[detected] ?? detected;
}
