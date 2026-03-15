import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HydrateClient, trpc } from '@/trpc/server';
import { LeaderboardList } from './_components/leaderboard-list';

export const metadata: Metadata = {
  title: 'Shame Leaderboard | devroast',
  description:
    'The most roasted code on the internet. A ranking of the worst code submissions.',
};

export default async function LeaderboardPage() {
  void trpc.leaderboard.list.prefetch({ limit: 20, offset: 0 });

  return (
    <HydrateClient>
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
          </div>

          {/* Entries */}
          <Suspense
            fallback={
              <p className="font-mono text-[13px] text-text-tertiary">
                {'// loading...'}
              </p>
            }
          >
            <LeaderboardList />
          </Suspense>
        </main>
      </div>
    </HydrateClient>
  );
}
