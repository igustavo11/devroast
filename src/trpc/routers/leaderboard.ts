import { z } from 'zod';
import { getLeaderboard } from '@/db';
import { baseProcedure, createTRPCRouter } from '../init';

export const leaderboardRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ input }) => {
      const result = await getLeaderboard({
        limit: input.limit,
        offset: input.offset,
      });

      return {
        entries: result.entries.map((entry) => ({
          ...entry,
          createdAt:
            entry.createdAt instanceof Date
              ? entry.createdAt
              : new Date(entry.createdAt),
        })),
        total: result.total,
      };
    }),
});
