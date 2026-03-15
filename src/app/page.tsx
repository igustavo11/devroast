import { MetricsNumbers } from '@/components/ui/metrics-numbers';
import {
  TableRowCode,
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from '@/components/ui/table-row';
import { HydrateClient, trpc } from '@/trpc/server';
import { CodeEditorSection } from './_components/code-editor-section';

const LEADERBOARD_ROWS = [
  {
    rank: 1,
    score: 1.2,
    codePreview:
      'eval(prompt("enter code"))  document.write(response)  // trust the user lol',
    lang: 'javascript',
  },
  {
    rank: 2,
    score: 1.8,
    codePreview:
      'if (x == true) { return true; }  else if (x == false) { return false; }  else { return !false; }',
    lang: 'typescript',
  },
  {
    rank: 3,
    score: 2.1,
    codePreview: 'SELECT * FROM users WHERE 1=1  -- TODO: add authentication',
    lang: 'sql',
  },
];

export default async function Home() {
  void trpc.metrics.summary.prefetch();

  return (
    <HydrateClient>
      <main className="mx-auto max-w-[960px] px-10 pt-20 pb-15 flex flex-col items-center gap-8">
        {/* Hero */}
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[36px] font-bold text-accent-green leading-none">
              $
            </span>
            <span className="font-mono text-[36px] font-bold text-text-primary leading-none">
              paste your code. get roasted.
            </span>
          </div>
          <p className="font-mono text-[14px] text-text-secondary">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </div>

        {/* Code Input Block */}
        <CodeEditorSection />

        {/* Footer Hint */}
        <div className="flex items-center gap-6 justify-center">
          <MetricsNumbers />
        </div>

        {/* Spacer */}
        <div className="h-[60px]" />

        {/* Shame Leaderboard Preview */}
        <div className="flex flex-col gap-6 w-full">
          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[14px] font-bold text-accent-green">
                  {'// '}
                </span>
                <span className="font-mono text-[14px] font-bold text-text-primary">
                  shame_leaderboard
                </span>
              </div>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 border border-border-primary font-mono text-[12px] text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors cursor-pointer"
              >
                $ view_all &gt;&gt;
              </button>
            </div>
            <p className="font-mono text-[13px] text-text-tertiary">
              {'// the worst code on the internet, ranked by shame'}
            </p>
          </div>

          {/* Table */}
          <div className="w-full border border-border-primary">
            {/* Table Header */}
            <div className="flex items-center h-10 px-5 bg-bg-surface border-b border-border-primary font-mono">
              <div className="w-10 shrink-0">
                <span className="text-[12px] font-medium text-text-tertiary">
                  #
                </span>
              </div>
              <div className="w-[60px] shrink-0">
                <span className="text-[12px] font-medium text-text-tertiary">
                  score
                </span>
              </div>
              <div className="flex-1">
                <span className="text-[12px] font-medium text-text-tertiary">
                  code
                </span>
              </div>
              <div className="w-[100px] shrink-0 text-right">
                <span className="text-[12px] font-medium text-text-tertiary">
                  lang
                </span>
              </div>
            </div>

            {/* Rows */}
            {LEADERBOARD_ROWS.map((row, i) => (
              <TableRowRoot
                key={row.rank}
                className={
                  i === LEADERBOARD_ROWS.length - 1 ? 'border-b-0' : undefined
                }
              >
                <TableRowRank>{row.rank}</TableRowRank>
                <TableRowScore value={row.score} />
                <TableRowCode>{row.codePreview}</TableRowCode>
                <TableRowLang>{row.lang}</TableRowLang>
              </TableRowRoot>
            ))}
          </div>

          {/* Table Footer */}
          <div className="flex justify-center py-4">
            <span className="font-mono text-[12px] text-text-tertiary">
              showing top 3 of 2,847 · view full leaderboard &gt;&gt;
            </span>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
