import { twMerge } from 'tailwind-merge';

type ScoreRingProps = {
  score: number;
  className?: string;
};

const SIZE = 180;
const STROKE = 4;
const R = (SIZE - STROKE) / 2; // 88
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_FRACTION = 0.35;

export function ScoreRing({ score, className }: ScoreRingProps) {
  const arcLength = CIRCUMFERENCE * ARC_FRACTION;
  const gapLength = CIRCUMFERENCE - arcLength;

  return (
    <div
      className={twMerge('relative', className)}
      style={{ width: SIZE, height: SIZE }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        fill="none"
        role="img"
        aria-label={`Score: ${score.toFixed(1)} out of 10`}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="100%" stopColor="var(--color-accent-amber)" />
          </linearGradient>
        </defs>

        {/* Anel de fundo */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="var(--color-border-primary)"
          strokeWidth={STROKE}
        />

        {/* Arco gradiente — 35%, começa do topo */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke="url(#scoreGradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${gapLength}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span className="font-mono text-[48px] font-bold text-text-primary leading-none">
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-[16px] font-normal text-text-tertiary leading-none">
          /10
        </span>
      </div>
    </div>
  );
}
