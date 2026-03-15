export type RoastFeedbackItem = {
  line: number;
  column?: number;
  severity: 'error' | 'warning' | 'info' | 'suggestion';
  message: string;
  category?: string;
};

export type RoastFeedback = RoastFeedbackItem[];

export type RoastRequest = {
  code: string;
  language: string;
  roastMode: 'brutal' | 'roast';
};

export type RoastResponse = {
  id: string;
  submissionId: string;
  score: number;
  feedback: RoastFeedback;
  summary: string;
};

export type LeaderboardEntry = {
  rank: number;
  submissionId: string;
  codePreview: string;
  language: string;
  roastMode: 'brutal' | 'roast' | string;
  score: number;
  feedback: RoastFeedback;
  summary: string;
  createdAt: string | Date;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  total: number;
};

export type SubmissionDetail = {
  id: string;
  code: string;
  language: string;
  roastMode: string;
  createdAt: Date;
  roast: {
    id: string;
    score: number;
    feedback: RoastFeedback;
    summary: string;
    createdAt: Date;
  } | null;
};

export const SUPPORTED_LANGUAGES = [
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
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
