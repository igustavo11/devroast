import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import {
  CodeBlockBody,
  CodeBlockHeader,
  CodeBlockRoot,
} from '@/components/ui/code-block';
import { DiffLine } from '@/components/ui/diff-line';
import { ScoreRing } from '@/components/ui/score-ring';

export const metadata: Metadata = {
  title: 'Roast Results | devroast',
  description: 'Your code has been roasted. See the brutal verdict.',
};

// ---------------------------------------------------------------------------
// Static data — will be replaced with real DB fetch once backend is wired
// ---------------------------------------------------------------------------

const STATIC_ROAST = {
  id: 'static',
  score: 3.5,
  verdict: 'needs_serious_help' as const,
  summary:
    '"this code looks like it was written during a power outage... in 2005."',
  lang: 'javascript',
  submittedAt: '2 hours ago',
  code: `function calculateTotal(items) {
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
}`,
  issues: [
    {
      severity: 'critical' as const,
      title: 'using var instead of const/let',
      description:
        'var is function-scoped and leads to hoisting bugs. use const by default, let when reassignment is needed.',
    },
    {
      severity: 'warning' as const,
      title: 'imperative loop pattern',
      description:
        'for loops are verbose and error-prone. use .reduce() or .map() for cleaner, functional transformations.',
    },
    {
      severity: 'good' as const,
      title: 'clear naming conventions',
      description:
        'calculateTotal and items are descriptive, self-documenting names that communicate intent without comments.',
    },
    {
      severity: 'good' as const,
      title: 'single responsibility',
      description:
        'the function does one thing well — calculates a total. no side effects, no mixed concerns, no hidden complexity.',
    },
  ],
  diff: [
    { type: 'context' as const, code: 'function calculateTotal(items) {' },
    { type: 'removed' as const, code: '  var total = 0;' },
    {
      type: 'removed' as const,
      code: '  for (var i = 0; i < items.length; i++) {',
    },
    { type: 'removed' as const, code: '    total = total + items[i].price;' },
    { type: 'removed' as const, code: '  }' },
    { type: 'removed' as const, code: '  if (total > 100) { total *= 0.9; }' },
    {
      type: 'added' as const,
      code: '  return items.reduce((sum, item) => sum + item.price, 0);',
    },
    { type: 'context' as const, code: '}' },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreColor(score: number) {
  if (score <= 3) return 'text-accent-red';
  if (score <= 6) return 'text-accent-amber';
  return 'text-accent-green';
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type IssueSeverity = 'critical' | 'warning' | 'good';

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RoastPage({ params }: { params: { id: string } }) {
  // `params.id` will be the UUID from the URL — e.g. /roast/abc-123
  // For now we ignore it and render static data
  void params.id;

  const roast = STATIC_ROAST;
  const lines = roast.code.split('\n').length;

  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      <main className="flex-1 flex flex-col gap-10 px-20 py-10">
        {/* Score Hero */}
        <div className="flex items-center gap-12 w-full">
          {/* Score Ring */}
          <ScoreRing score={roast.score} />

          {/* Summary */}
          <div className="flex flex-col gap-4 flex-1">
            <Badge variant="verdict" label={`verdict: ${roast.verdict}`} />

            <p
              className={`font-mono text-[20px] leading-relaxed ${scoreColor(roast.score)}`}
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {roast.summary}
            </p>

            <div className="flex items-center gap-4 font-mono text-[12px] text-text-tertiary">
              <span>lang: {roast.lang}</span>
              <span>·</span>
              <span>{lines} lines</span>
              <span>·</span>
              <span>{roast.submittedAt}</span>
            </div>

            {/* Share button */}
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

        {/* ── Submitted Code ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 w-full">
          <SectionTitle>your_submission</SectionTitle>

          <CodeBlockRoot>
            <CodeBlockHeader filename={`submission.${roast.lang}`} />
            <CodeBlockBody code={roast.code} lang={roast.lang} />
          </CodeBlockRoot>
        </div>

        <Divider />

        {/* ── Detailed Analysis ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 w-full">
          <SectionTitle>detailed_analysis</SectionTitle>

          <div className="flex flex-col gap-5">
            {/* Row 1 */}
            <div className="flex gap-5">
              {roast.issues.slice(0, 2).map((issue) => (
                <IssueCard key={issue.title} {...issue} />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex gap-5">
              {roast.issues.slice(2, 4).map((issue) => (
                <IssueCard key={issue.title} {...issue} />
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ── Suggested Fix ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6 w-full">
          <SectionTitle>suggested_fix</SectionTitle>

          <div className="border border-border-primary bg-bg-input overflow-hidden">
            {/* Diff header */}
            <div className="flex items-center h-10 border-b border-border-primary px-4 font-mono text-[12px] font-medium text-text-secondary">
              your_code.ts → improved_code.ts
            </div>

            {/* Diff lines */}
            <div className="py-1">
              {roast.diff.map((line, i) => (
                <DiffLine
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff lines are positional
                  key={i}
                  variant={line.type}
                  code={line.code}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
