import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HydrateClient, trpc } from '@/trpc/server';
import { RoastDetail } from './_components/roast-detail';

export const metadata: Metadata = {
  title: 'Roast Results | devroast',
  description: 'Your code has been roasted. See the brutal verdict.',
};

export default async function RoastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  void trpc.roast.getById.prefetch({ id });

  return (
    <HydrateClient>
      <div className="min-h-screen bg-bg-page flex flex-col">
        <Suspense
          fallback={
            <main className="flex-1 flex items-center justify-center px-20 py-10">
              <p className="font-mono text-[13px] text-text-tertiary">
                {'// analyzing your code...'}
              </p>
            </main>
          }
        >
          <RoastDetail id={id} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
