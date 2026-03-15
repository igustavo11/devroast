import type { Metadata } from 'next';
import { NavbarLogo, NavbarNav, NavbarRoot } from '@/components/ui/navbar';
import {
  TableRowCode,
  TableRowLang,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from '@/components/ui/table-row';

export const metadata: Metadata = {
  title: 'Shame Leaderboard | devroast',
  description:
    'The most roasted code on the internet. A ranking of the worst code submissions.',
};

// Static leaderboard data
const LEADERBOARD_ENTRIES = [
  {
    rank: 1,
    score: 1.2,
    codePreview:
      'eval(prompt("enter code"))  document.write(response)  // trust the user lol',
    lang: 'javascript',
    author: 'anonymous',
    submittedAt: '2 hours ago',
  },
  {
    rank: 2,
    score: 1.8,
    codePreview:
      'if (x == true) { return true; }  else if (x == false) { return false; }  else { return !false; }',
    lang: 'typescript',
    author: 'anonymous',
    submittedAt: '5 hours ago',
  },
  {
    rank: 3,
    score: 2.1,
    codePreview: 'SELECT * FROM users WHERE 1=1  -- TODO: add authentication',
    lang: 'sql',
    author: 'anonymous',
    submittedAt: '1 day ago',
  },
  {
    rank: 4,
    score: 2.5,
    codePreview: 'while(true) { i = i + 1; }  // infinite loop for performance',
    lang: 'python',
    author: 'anonymous',
    submittedAt: '2 days ago',
  },
  {
    rank: 5,
    score: 2.7,
    codePreview:
      'let var = "undefined"; let undefined = var;  // clever variable shadowing',
    lang: 'javascript',
    author: 'anonymous',
    submittedAt: '3 days ago',
  },
  {
    rank: 6,
    score: 2.9,
    codePreview:
      'catch (Exception e) { }  // silent fail, no one needs to know about errors',
    lang: 'java',
    author: 'anonymous',
    submittedAt: '4 days ago',
  },
  {
    rank: 7,
    score: 3.1,
    codePreview:
      'setInterval(() => console.log("memory leak detected"), 0)  // instant debugging',
    lang: 'javascript',
    author: 'anonymous',
    submittedAt: '5 days ago',
  },
  {
    rank: 8,
    score: 3.3,
    codePreview: 'DELETE FROM users;  -- oops, typo in WHERE clause',
    lang: 'sql',
    author: 'anonymous',
    submittedAt: '6 days ago',
  },
  {
    rank: 9,
    score: 3.5,
    codePreview:
      'const data = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"  // passwords are for amateurs',
    lang: 'javascript',
    author: 'anonymous',
    submittedAt: '1 week ago',
  },
  {
    rank: 10,
    score: 3.7,
    codePreview:
      'Array.from(Array(100000), (_, i) => i).map(x => x)  // quadratic time complexity ftw',
    lang: 'typescript',
    author: 'anonymous',
    submittedAt: '1 week ago',
  },
];

const STATS = [
  { label: 'Total Roasted', value: '12,847' },
  { label: 'Avg Score', value: '3.2/10' },
  { label: 'Worst Code', value: '1.2/10' },
];

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-bg-page flex flex-col">
      {/* Navbar */}
      <NavbarRoot>
        <NavbarLogo>devroast</NavbarLogo>
        <NavbarNav>
          <span className="font-mono text-[13px] text-text-secondary">
            leaderboard
          </span>
        </NavbarNav>
      </NavbarRoot>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-20 py-10 gap-10">
        {/* Hero Section */}
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[20px] font-bold text-accent-green leading-none">
              &gt;
            </span>
            <h1 className="font-mono text-[32px] font-bold text-text-primary leading-none">
              shame_leaderboard
            </h1>
          </div>
          <p className="font-mono text-[14px] text-text-secondary mb-6">
            {'// the most roasted code on the internet'}
          </p>

          {/* Stats Row */}
          <div className="flex items-center gap-8">
            {STATS.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[12px] text-text-tertiary">
                    {stat.label}
                  </span>
                  <span className="font-mono text-[18px] font-bold text-text-primary">
                    {stat.value}
                  </span>
                </div>
                {index < STATS.length - 1 && (
                  <div className="w-px h-12 bg-border-primary" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="w-full flex flex-col gap-6">
          {/* Table */}
          <div className="w-full border border-border-primary">
            {/* Table Header */}
            <div className="flex items-center h-10 px-5 bg-bg-elevated border-b border-border-primary font-mono">
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
            {LEADERBOARD_ENTRIES.map((entry, i) => (
              <TableRowRoot
                key={entry.rank}
                className={
                  i === LEADERBOARD_ENTRIES.length - 1
                    ? 'border-b-0'
                    : undefined
                }
              >
                <TableRowRank>{entry.rank}</TableRowRank>
                <TableRowScore value={entry.score} />
                <TableRowCode>{entry.codePreview}</TableRowCode>
                <TableRowLang>{entry.lang}</TableRowLang>
              </TableRowRoot>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-center py-4">
            <span className="font-mono text-[12px] text-text-tertiary">
              showing all {LEADERBOARD_ENTRIES.length} submissions
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
