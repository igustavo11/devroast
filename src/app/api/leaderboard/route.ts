import { type NextRequest, NextResponse } from 'next/server';
import { getLeaderboard } from '@/db';
import type { LeaderboardResponse } from '@/types/roast';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(
      parseInt(searchParams.get('limit') || '20', 10),
      100,
    );
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const result = await getLeaderboard({ limit, offset });

    const response: LeaderboardResponse = {
      entries: result.entries.map((entry) => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
      })),
      total: result.total,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 },
    );
  }
}
