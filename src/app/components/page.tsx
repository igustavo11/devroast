import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardRoot, CardBadge, CardTitle, CardDescription } from '@/components/ui/card';
import { CodeBlockRoot, CodeBlockHeader, CodeBlockBody } from '@/components/ui/code-block';
import { DiffLine } from '@/components/ui/diff-line';
import { NavbarRoot, NavbarLogo, NavbarNav } from '@/components/ui/navbar';
import { ScoreRing } from '@/components/ui/score-ring';
import { TableRowRoot, TableRowRank, TableRowScore, TableRowCode, TableRowLang } from '@/components/ui/table-row';
import { Toggle } from '@/components/ui/toggle';

function Section({
  title,
  children,
  stack = false,
}: {
  title: string;
  children: React.ReactNode;
  stack?: boolean;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="border-b border-border-primary pb-2 font-mono text-xs font-bold uppercase tracking-widest">
        <span className="text-accent-green">{'// '}</span>
        <span className="text-text-primary">{title}</span>
      </h2>
      <div className={stack ? 'flex flex-col gap-0' : 'flex flex-wrap items-end gap-3'}>
        {children}
      </div>
    </section>
  );
}

const SAMPLE_CODE = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
}`;

export default async function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-primary">
      {/* Navbar preview — full width */}
      <NavbarRoot>
        <NavbarLogo>devroast</NavbarLogo>
        <NavbarNav>
          <span className="font-mono text-[13px] text-text-secondary">leaderboard</span>
        </NavbarNav>
      </NavbarRoot>

      <main className="flex flex-col gap-12 px-12 py-16">
        <h1 className="font-mono text-2xl font-bold">
          <span className="text-accent-green">{'// '}</span>component_library
        </h1>

        {/* ── Button ── */}
        <Section title="buttons">
          <Button variant="primary" size="md">$ roast_my_code</Button>
          <Button variant="secondary" size="md">$ share_roast</Button>
          <Button variant="outline" size="md">$ view_all &gt;&gt;</Button>
          <Button variant="ghost" size="md">$ cancel</Button>
          <Button variant="destructive" size="md">$ delete</Button>
        </Section>

        <Section title="buttons / sizes">
          <Button variant="primary" size="sm">$ small</Button>
          <Button variant="primary" size="md">$ medium</Button>
          <Button variant="primary" size="lg">$ large</Button>
        </Section>

        <Section title="buttons / disabled">
          <Button variant="primary" size="md" disabled>$ primary</Button>
          <Button variant="secondary" size="md" disabled>$ secondary</Button>
          <Button variant="outline" size="md" disabled>$ outline</Button>
          <Button variant="ghost" size="md" disabled>$ ghost</Button>
          <Button variant="destructive" size="md" disabled>$ destructive</Button>
        </Section>

        {/* ── Toggle ── */}
        <Section title="toggle">
          <div className="flex items-center gap-3">
            <Toggle defaultChecked />
            <span className="font-mono text-[12px] text-accent-green">roast mode</span>
          </div>
          <div className="flex items-center gap-3">
            <Toggle />
            <span className="font-mono text-[12px] text-text-secondary">roast mode</span>
          </div>
          <Toggle disabled />
          <Toggle defaultChecked disabled />
        </Section>

        {/* ── Badge ── */}
        <Section title="badge_status">
          <Badge variant="critical" label="critical" />
          <Badge variant="warning" label="warning" />
          <Badge variant="good" label="good" />
          <Badge variant="verdict" label="needs_serious_help" />
        </Section>

        {/* ── Card ── */}
        <Section title="cards">
          <CardRoot variant="critical" style={{ width: 480 }}>
            <CardBadge variant="critical" />
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which can lead to
              unexpected behavior and bugs. modern javascript uses const for immutable bindings
              and let for mutable ones.
            </CardDescription>
          </CardRoot>
          <CardRoot variant="warning" style={{ width: 480 }}>
            <CardBadge variant="warning" />
            <CardTitle>missing error handling in async function</CardTitle>
            <CardDescription>
              async operations that can fail should always be wrapped in try/catch blocks
              or handle promise rejections properly to avoid unhandled exceptions.
            </CardDescription>
          </CardRoot>
          <CardRoot variant="good" style={{ width: 480 }}>
            <CardBadge variant="good" />
            <CardTitle>good use of destructuring</CardTitle>
            <CardDescription>
              clean destructuring pattern makes the code more readable and concise.
              this is idiomatic modern javascript.
            </CardDescription>
          </CardRoot>
        </Section>

        {/* ── CodeBlock ── */}
        <Section title="code_block">
          <div style={{ width: 560 }}>
            <CodeBlockRoot>
              <CodeBlockHeader filename="calculate.js" />
              <CodeBlockBody code={SAMPLE_CODE} lang="javascript" />
            </CodeBlockRoot>
          </div>
          <div style={{ width: 560 }}>
            <CodeBlockRoot>
              <CodeBlockHeader />
              <CodeBlockBody code={SAMPLE_CODE} lang="javascript" />
            </CodeBlockRoot>
          </div>
        </Section>

        {/* ── DiffLine ── */}
        <Section title="diff_line" stack>
          <div style={{ width: 560 }}>
            <DiffLine variant="removed" code="var total = 0;" />
            <DiffLine variant="added" code="const total = 0;" />
            <DiffLine variant="context" code="for (let i = 0; i < items.length; i++) {" />
          </div>
        </Section>

        {/* ── TableRow ── */}
        <Section title="table_row" stack>
          <TableRowRoot>
            <TableRowRank>1</TableRowRank>
            <TableRowScore value={2.1} />
            <TableRowCode>function calculateTotal(items) {'{'} var total = 0; ...</TableRowCode>
            <TableRowLang>javascript</TableRowLang>
          </TableRowRoot>
          <TableRowRoot>
            <TableRowRank>2</TableRowRank>
            <TableRowScore value={5.4} />
            <TableRowCode>const fetchUser = async (id) =&gt; {'{'} return await api.get(id) {'}'}</TableRowCode>
            <TableRowLang>typescript</TableRowLang>
          </TableRowRoot>
          <TableRowRoot>
            <TableRowRank>3</TableRowRank>
            <TableRowScore value={8.7} />
            <TableRowCode>export const sum = (a: number, b: number) =&gt; a + b</TableRowCode>
            <TableRowLang>typescript</TableRowLang>
          </TableRowRoot>
        </Section>

        {/* ── ScoreRing ── */}
        <Section title="score_ring">
          <ScoreRing score={2.1} />
          <ScoreRing score={5.5} />
          <ScoreRing score={8.7} />
        </Section>
      </main>
    </div>
  );
}
