import { pgEnum } from 'drizzle-orm/pg-core';

export const roastModeEnum = pgEnum('roast_mode', ['brutal', 'roast']);

export const languageEnum = pgEnum('language', [
  'javascript',
  'typescript',
  'tsx',
  'jsx',
  'python',
  'rust',
  'go',
  'java',
  'kotlin',
  'swift',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'bash',
  'shell',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'plaintext',
]);
