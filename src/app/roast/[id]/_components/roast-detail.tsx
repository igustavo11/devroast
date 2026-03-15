'use client';

import { Badge } from '@/components/ui/badge';
import {
  CodeBlockBody,
  CodeBlockHeader,
  CodeBlockRoot,
} from '@/components/ui/code-block';
import { DiffLine } from '@/components/ui/diff-line';
import { ScoreRing } from '@/components/ui/score-ring';
import { trpc } from '@/trpc/client';
import type { RoastFeedbackItem } from '@/types/roast';

type IssueSeverity = 'critical' | 'warning' | 'good';

function severityMap(s: RoastFeedbackItem['severity']): IssueSeverity {
  if (s === 'error') return 'critical';
  if (s === 'warning') return 'warning';
  return 'good';
}

function scoreColor(score: number) {
  if (score <= 3) return 'text-accent-red';
  if (score <= 6) return 'text-accent-amber';
  return 'text-accent-green';
}

function verdictLabel(score: number) {
  if (score <= 3) return 'verdict: needs_serious_help';
  if (score <= 6) return 'verdict: could_be_worse';
  return 'verdict: not_completely_terrible';
}

function IssueCard({
  severity,
  title,
  description,
}: {
  severity: IssueSeverity;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 border border-border-primary p-5 flex-1">
      <Badge variant={severity} label={severity} />
      <p className="font-mono text-[13px] font-medium text-text-primary">
        {title}
      </p>
      <p
        className="font-mono text-[12px] text-text-secondary leading-relaxed"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {description}
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[14px] font-bold text-accent-green">
        {'//'}
      </span>
      <span className="font-mono text-[14px] font-bold text-text-primary">
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border-primary" />;
}

export function RoastDetail({ id }: { id: string }) {
  const [data] = trpc.roast.getById.useSuspenseQuery({ id });

  const roast = data.roast;
  const lines = data.code.split('\n').length;
  const score = roast?.score ?? 0;

  return (
    <main className="flex-1 flex flex-col gap-10 px-20 py-10">
      {/* Score Hero */}
      <div className="flex items-center gap-12 w-full">
        <ScoreRing score={score} />

        <div className="flex flex-col gap-4 flex-1">
          <Badge variant="verdict" label={verdictLabel(score)} />

          <p
            className={`font-mono text-[20px] leading-relaxed ${scoreColor(score)}`}
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {roast ? `"${roast.summary}"` : '// no roast data found'}
          </p>

          <div className="flex items-center gap-4 font-mono text-[12px] text-text-tertiary">
            <span>lang: {data.language}</span>
            <span>·</span>
            <span>{lines} lines</span>
            <span>·</span>
            <span>
              {data.createdAt
                ? new Date(data.createdAt).toLocaleDateString()
                : ''}
            </span>
          </div>

          <div>
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-border-primary px-4 py-2 font-mono text-[12px] text-text-primary hover:border-accent-green hover:text-accent-green transition-colors"
            >
              $ share_roast
            </button>
          </div>
        </div>
      </div>

      <Divider />

      {/* Submitted Code */}
      <div className="flex flex-col gap-4 w-full">
        <SectionTitle>your_submission</SectionTitle>

        <CodeBlockRoot>
          <CodeBlockHeader filename={`submission.${data.language}`} />
          <CodeBlockBody code={data.code} lang={data.language} />
        </CodeBlockRoot>
      </div>

      <Divider />

      {/* Detailed Analysis */}
      {roast && roast.feedback.length > 0 && (
        <div className="flex flex-col gap-6 w-full">
          <SectionTitle>detailed_analysis</SectionTitle>

          <div className="flex flex-col gap-5">
            {Array.from(
              { length: Math.ceil(roast.feedback.length / 2) },
              (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: row index is stable
                <div key={i} className="flex gap-5">
                  {roast.feedback.slice(i * 2, i * 2 + 2).map((item) => (
                    <IssueCard
                      key={`${item.line}-${item.message}`}
                      severity={severityMap(item.severity)}
                      title={item.message}
                      description={
                        item.category
                          ? `[${item.category}] line ${item.line}`
                          : `line ${item.line}`
                      }
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {roast && roast.feedback.length > 0 && <Divider />}

      {/* Suggested Fix placeholder */}
      <div className="flex flex-col gap-6 w-full">
        <SectionTitle>suggested_fix</SectionTitle>

        <div className="border border-border-primary bg-bg-input overflow-hidden">
          <div className="flex items-center h-10 border-b border-border-primary px-4 font-mono text-[12px] font-medium text-text-secondary">
            your_code.{data.language} → improved_code.{data.language}
          </div>

          <div className="py-1">
            <DiffLine
              variant="context"
              code="// AI-generated suggestions coming soon"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
