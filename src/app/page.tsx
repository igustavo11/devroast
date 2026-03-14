'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import {
  TableRowRoot,
  TableRowRank,
  TableRowScore,
  TableRowCode,
  TableRowLang,
} from '@/components/ui/table-row';

const PLACEHOLDER_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }

  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }

  // TODO: handle tax calculation
  // TODO: handle currency conversion

  return total;
}`;

const LINE_COUNT = PLACEHOLDER_CODE.split('\n').length;

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

export default function Home() {
  const [code, setCode] = useState(PLACEHOLDER_CODE);
  const [roastMode, setRoastMode] = useState(true);
  const lineCount = code.split('\n').length;

  return (
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
      <div className="w-full max-w-[780px] border border-border-primary bg-bg-input flex flex-col h-[360px]">
        {/* Window Header */}
        <div className="flex items-center h-10 px-4 border-b border-border-primary shrink-0">
          <div className="flex items-center gap-2">
            <span className="block size-3 rounded-full bg-accent-red" />
            <span className="block size-3 rounded-full bg-accent-amber" />
            <span className="block size-3 rounded-full bg-accent-green" />
          </div>
        </div>

        {/* Code Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Line Numbers */}
          <div className="flex flex-col items-end px-3 py-4 bg-bg-surface border-r border-border-primary shrink-0 w-12 overflow-hidden select-none">
            {Array.from(
              { length: Math.max(lineCount, LINE_COUNT) },
              (_, i) => i + 1,
            ).map((n) => (
              <span
                key={n}
                className="font-mono text-[12px] text-text-tertiary leading-[18px]"
              >
                {n}
              </span>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-[12px] text-text-primary leading-[18px] px-4 py-4 resize-none outline-none w-full overflow-hidden"
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between w-full max-w-[780px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Toggle checked={roastMode} onCheckedChange={setRoastMode} />
            <span className="font-mono text-[13px] text-accent-green">
              roast mode
            </span>
          </div>
          <span className="font-mono text-[12px] text-text-tertiary">
            {'// maximum sarcasm enabled'}
          </span>
        </div>

        <Button size="md">$ roast_my_code</Button>
      </div>

      {/* Footer Hint */}
      <div className="flex items-center gap-6 justify-center">
        <span className="font-mono text-[12px] text-text-tertiary">
          2,847 codes roasted
        </span>
        <span className="font-mono text-[12px] text-text-tertiary">·</span>
        <span className="font-mono text-[12px] text-text-tertiary">
          avg score: 4.2/10
        </span>
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
  );
}
