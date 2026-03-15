'use client';

import { CodeBlockBody, CodeBlockRoot } from '@/components/ui/code-block';
import { trpc } from '@/trpc/client';

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

export function LeaderboardList() {
  const [data] = trpc.leaderboard.list.useSuspenseQuery({
    limit: 20,
    offset: 0,
  });

  return (
    <>
      <div className="flex items-center gap-2 font-mono text-[12px] text-text-tertiary">
        <span>{data.total} submissions</span>
      </div>

      <div className="flex flex-col gap-5">
        {data.entries.map((entry) => {
          const lines = entry.codePreview.split('\n').length;
          return (
            <CodeBlockRoot key={entry.submissionId}>
              <EntryHeader
                rank={entry.rank}
                score={entry.score}
                lang={entry.language}
                lines={lines}
              />
              <CodeBlockBody code={entry.codePreview} lang={entry.language} />
            </CodeBlockRoot>
          );
        })}
      </div>
    </>
  );
}
