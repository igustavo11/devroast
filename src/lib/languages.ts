export type Language = {
  label: string;
  src: () => Promise<unknown>;
};

export const LANGUAGES: Record<string, Language> = {
  javascript: {
    label: 'JavaScript',
    src: () => import('shiki/langs/javascript.mjs'),
  },
  typescript: {
    label: 'TypeScript',
    src: () => import('shiki/langs/typescript.mjs'),
  },
  tsx: {
    label: 'TSX',
    src: () => import('shiki/langs/tsx.mjs'),
  },
  jsx: {
    label: 'JSX',
    src: () => import('shiki/langs/jsx.mjs'),
  },
  python: {
    label: 'Python',
    src: () => import('shiki/langs/python.mjs'),
  },
  rust: {
    label: 'Rust',
    src: () => import('shiki/langs/rust.mjs'),
  },
  go: {
    label: 'Go',
    src: () => import('shiki/langs/go.mjs'),
  },
  java: {
    label: 'Java',
    src: () => import('shiki/langs/java.mjs'),
  },
  kotlin: {
    label: 'Kotlin',
    src: () => import('shiki/langs/kotlin.mjs'),
  },
  swift: {
    label: 'Swift',
    src: () => import('shiki/langs/swift.mjs'),
  },
  c: {
    label: 'C',
    src: () => import('shiki/langs/c.mjs'),
  },
  cpp: {
    label: 'C++',
    src: () => import('shiki/langs/cpp.mjs'),
  },
  csharp: {
    label: 'C#',
    src: () => import('shiki/langs/csharp.mjs'),
  },
  php: {
    label: 'PHP',
    src: () => import('shiki/langs/php.mjs'),
  },
  ruby: {
    label: 'Ruby',
    src: () => import('shiki/langs/ruby.mjs'),
  },
  bash: {
    label: 'Bash',
    src: () => import('shiki/langs/bash.mjs'),
  },
  shell: {
    label: 'Shell',
    src: () => import('shiki/langs/shellscript.mjs'),
  },
  sql: {
    label: 'SQL',
    src: () => import('shiki/langs/sql.mjs'),
  },
  html: {
    label: 'HTML',
    src: () => import('shiki/langs/html.mjs'),
  },
  css: {
    label: 'CSS',
    src: () => import('shiki/langs/css.mjs'),
  },
  json: {
    label: 'JSON',
    src: () => import('shiki/langs/json.mjs'),
  },
  yaml: {
    label: 'YAML',
    src: () => import('shiki/langs/yaml.mjs'),
  },
  markdown: {
    label: 'Markdown',
    src: () => import('shiki/langs/markdown.mjs'),
  },
  plaintext: {
    label: 'Plaintext',
    src: () => import('shiki/langs/javascript.mjs'),
  },
};

export const LANGUAGE_KEYS = Object.keys(LANGUAGES);

// hljs uses different names for some languages — map them to our keys
export const HLJS_ALIAS_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  'c++': 'cpp',
  'c#': 'csharp',
  cs: 'csharp',
  yml: 'yaml',
  md: 'markdown',
  xml: 'html',
};
