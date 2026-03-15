'use client';

import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type UIEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { HighlighterGeneric } from 'shiki';
import { detectLanguage } from '@/lib/detect-language';
import { ensureLanguageLoaded, getHighlighter } from '@/lib/highlighter';
import { LANGUAGES } from '@/lib/languages';
import { LanguageSelect } from './language-select';

// ─── Context ────────────────────────────────────────────────────────────────

type CodeEditorContextValue = {
  value: string;
  onChange: (v: string) => void;
  activeLang: string;
  detectedLanguage: string;
  selectedLanguage: string | null;
  onLanguageChange: (lang: string | null) => void;
  highlightedHtml: string;
  lineCount: number;
  scrollTop: number;
  onScroll: (e: UIEvent<HTMLTextAreaElement>) => void;
};

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

function useCodeEditor() {
  const ctx = useContext(CodeEditorContext);
  if (!ctx)
    throw new Error('CodeEditor sub-components must be inside CodeEditorRoot');
  return ctx;
}

// ─── Root ────────────────────────────────────────────────────────────────────

type CodeEditorRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  /** Exposed for parent to read the active language (e.g. to send to API) */
  onLanguageDetected?: (lang: string) => void;
};

export function CodeEditorRoot({
  value,
  onChange,
  onLanguageDetected,
  className,
  children,
  ...props
}: CodeEditorRootProps) {
  const [detectedLanguage, setDetectedLanguage] = useState('javascript');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [highlightedHtml, setHighlightedHtml] = useState('');
  const [scrollTop, setScrollTop] = useState(0);
  const highlighterRef = useRef<HighlighterGeneric<string, string> | null>(
    null,
  );
  const detectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLang = selectedLanguage ?? detectedLanguage;
  const lineCount = value.split('\n').length;

  // Initialize Shiki singleton
  useEffect(() => {
    getHighlighter().then((h) => {
      highlighterRef.current = h;
    });
  }, []);

  // Debounced language detection
  useEffect(() => {
    if (detectTimerRef.current) clearTimeout(detectTimerRef.current);
    detectTimerRef.current = setTimeout(() => {
      // Only auto-detect when in auto mode
      if (selectedLanguage !== null) return;
      const lang = detectLanguage(value);
      setDetectedLanguage(lang);
      onLanguageDetected?.(lang);
    }, 300);
    return () => {
      if (detectTimerRef.current) clearTimeout(detectTimerRef.current);
    };
  }, [value, selectedLanguage, onLanguageDetected]);

  // Notify parent when manual language is selected
  useEffect(() => {
    if (selectedLanguage !== null) {
      onLanguageDetected?.(selectedLanguage);
    }
  }, [selectedLanguage, onLanguageDetected]);

  // Re-highlight whenever value or active language changes
  useEffect(() => {
    const h = highlighterRef.current;
    if (!h) return;

    let cancelled = false;
    const langDef = LANGUAGES[activeLang] ?? LANGUAGES.plaintext;

    async function highlight() {
      if (!h) return;
      await ensureLanguageLoaded(h, activeLang, langDef.src);
      if (cancelled) return;

      // plaintext: render as plain text without Shiki
      const lang = activeLang === 'plaintext' ? 'javascript' : activeLang;

      const html = h.codeToHtml(value || ' ', {
        lang,
        theme: 'devroast',
      });

      if (!cancelled) setHighlightedHtml(html);
    }

    highlight();
    return () => {
      cancelled = true;
    };
  }, [value, activeLang]);

  const onScroll = useCallback((e: UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const onLanguageChange = useCallback(
    (lang: string | null) => {
      setSelectedLanguage(lang);
      if (lang === null) {
        // Re-run detection immediately on reset to Auto
        const detected = detectLanguage(value);
        setDetectedLanguage(detected);
        onLanguageDetected?.(detected);
      } else {
        onLanguageDetected?.(lang);
      }
    },
    [value, onLanguageDetected],
  );

  return (
    <CodeEditorContext.Provider
      value={{
        value,
        onChange,
        activeLang,
        detectedLanguage,
        selectedLanguage,
        onLanguageChange,
        highlightedHtml,
        lineCount,
        scrollTop,
        onScroll,
      }}
    >
      <div className={className} {...props}>
        {children}
      </div>
    </CodeEditorContext.Provider>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

type CodeEditorHeaderProps = ComponentProps<'div'>;

export function CodeEditorHeader({
  className,
  ...props
}: CodeEditorHeaderProps) {
  const { selectedLanguage, detectedLanguage, onLanguageChange } =
    useCodeEditor();

  return (
    <div
      className={[
        'flex items-center justify-between h-10 px-4 border-b border-border-primary shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* Window dots */}
      <div className="flex items-center gap-2">
        <span className="block size-3 rounded-full bg-accent-red" />
        <span className="block size-3 rounded-full bg-accent-amber" />
        <span className="block size-3 rounded-full bg-accent-green" />
      </div>

      {/* Language selector */}
      <LanguageSelect
        value={selectedLanguage}
        detectedLanguage={detectedLanguage}
        onValueChange={onLanguageChange}
      />
    </div>
  );
}

// ─── Body ─────────────────────────────────────────────────────────────────────

type CodeEditorBodyProps = ComponentProps<'div'>;

export function CodeEditorBody({ className, ...props }: CodeEditorBodyProps) {
  const { value, onChange, highlightedHtml, lineCount, scrollTop, onScroll } =
    useCodeEditor();
  const gutterRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync gutter and highlight scroll with textarea scroll
  useEffect(() => {
    if (gutterRef.current) gutterRef.current.scrollTop = scrollTop;
    if (highlightRef.current) highlightRef.current.scrollTop = scrollTop;
  }, [scrollTop]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newValue = `${value.substring(0, start)}  ${value.substring(end)}`;
      onChange(newValue);
      // Restore cursor after state update
      requestAnimationFrame(() => {
        el.selectionStart = start + 2;
        el.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div
      className={['flex flex-1 min-h-0 overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {/* Gutter */}
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="flex flex-col items-end px-3 py-4 bg-bg-surface border-r border-border-primary shrink-0 w-12 overflow-hidden select-none"
      >
        {Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1).map(
          (n) => (
            <span
              key={n}
              className="font-mono text-[12px] text-text-tertiary leading-[18px]"
            >
              {n}
            </span>
          ),
        )}
      </div>

      {/* Editor area: overlay grid */}
      <div className="relative flex-1 overflow-hidden">
        {/* Layer 1: Shiki highlight (below, pointer-events off) */}
        <div
          ref={highlightRef}
          aria-hidden="true"
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ scrollbarWidth: 'none' }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled Shiki output
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />

        {/* Layer 2: Transparent textarea (above) */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={onScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          aria-label="Code editor"
          aria-multiline="true"
          className={[
            'absolute inset-0 w-full h-full',
            'resize-none outline-none',
            'font-mono text-[12px] leading-[18px]',
            'px-4 py-4',
            'bg-transparent',
            'caret-text-primary',
            'overflow-y-auto overflow-x-hidden',
          ].join(' ')}
          style={{
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
