import type { Metadata } from 'next';
import { CodeBlockBody, CodeBlockRoot } from '@/components/ui/code-block';

export const metadata: Metadata = {
  title: 'Shame Leaderboard | devroast',
  description:
    'The most roasted code on the internet. A ranking of the worst code submissions.',
};

const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    score: 1.2,
    code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
    lang: 'javascript',
  },
  {
    rank: 2,
    score: 1.8,
    code: 'if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }',
    lang: 'typescript',
  },
  {
    rank: 3,
    score: 2.1,
    code: 'SELECT * FROM users WHERE 1=1\n-- TODO: add authentication',
    lang: 'sql',
  },
  {
    rank: 4,
    score: 2.5,
    code: 'while(true) {\n  i = i + 1;\n}\n// infinite loop for performance',
    lang: 'python',
  },
  {
    rank: 5,
    score: 2.7,
    code: 'let var = "undefined";\nlet undefined = var;\n// clever variable shadowing',
    lang: 'javascript',
  },
];

function scoreColor(score: number) {
  if (score <= 2) return 'text-accent-red';
  if (score <= 4) return 'text-accent-amber';
  return 'text-accent-green';
}

function rankColor(rank: number) {
  if (rank === 1) return 'text-accent-amber';
  if (rank === 2) return 'text-text-secondary';
  if (rank === 3) return 'text-accent-amber/60';
  return 'text-text-tertiary';
}

type EntryHeaderProps = {
  rank: number;
  score: number;
  lang: string;
  lines: number;
};

function EntryHeader({ rank, score, lang, lines }: EntryHeaderProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-border-primary px-5">
      {/* Left: macOS dots + rank + score */}
      <div className="flex items-center gap-4">
        {/* macOS dots */}
        <div className="flex items-center gap-[6px]">
          <span className="size-[10px] rounded-full bg-accent-red" />
          <span className="size-[10px] rounded-full bg-accent-amber" />
          <span className="size-[10px] rounded-full bg-accent-green" />
        </div>

        {/* Rank */}
        <div className="flex items-center gap-1 font-mono">
          <span className="text-[13px] text-text-tertiary">#</span>
          <span className={`text-[13px] font-bold ${rankColor(rank)}`}>
            {rank}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-[12px] text-text-tertiary">score:</span>
          <span className={`text-[13px] font-bold ${scoreColor(score)}`}>
            {score.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Right: lang + lines */}
      <div className="flex items-center gap-3 font-mono">
        <span className="text-[12px] text-text-secondary">{lang}</span>
        <span className="text-[12px] text-text-tertiary">{lines} lines</span>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <main className="flex-1 flex flex-col px-20 py-10 gap-10">
        {/* Hero */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[32px] font-bold text-accent-green leading-none">
              &gt;
            </span>
            <h1 className="font-mono text-[28px] font-bold text-text-primary leading-none">
              shame_leaderboard
            </h1>
          </div>
          <p className="font-mono text-[14px] text-text-secondary">
            {'// the most roasted code on the internet'}
          </p>
          <div className="flex items-center gap-2 font-mono text-[12px] text-text-tertiary">
            <span>2,847 submissions</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-5">
          {LEADERBOARD_ENTRIES.map((entry) => {
            const lines = entry.code.split('\n').length;
            return (
              <CodeBlockRoot key={entry.rank}>
                <EntryHeader
                  rank={entry.rank}
                  score={entry.score}
                  lang={entry.lang}
                  lines={lines}
                />
                <CodeBlockBody code={entry.code} lang={entry.lang} />
              </CodeBlockRoot>
            );
          })}
        </div>
      </main>
    </div>
  );
}
