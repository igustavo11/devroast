'use client';
import NumberFlow from '@number-flow/react';
import { trpc } from '@/trpc/client';

export function MetricsNumbers() {
  const { data } = trpc.metrics.summary.useQuery();

  return (
    <>
      <span className="font-mono text-[12px] text-text-tertiary">
        <NumberFlow value={data?.totalRoasts ?? 0} /> codes roasted
      </span>
      <span className="font-mono text-[12px] text-text-tertiary">·</span>
      <span className="font-mono text-[12px] text-text-tertiary">
        avg score:{' '}
        <NumberFlow
          value={data?.avgScore ?? 0}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </>
  );
}
