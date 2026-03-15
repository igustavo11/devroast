import { createTRPCRouter } from '../init';
import { leaderboardRouter } from './leaderboard';
import { metricsRouter } from './metrics';
import { roastRouter } from './roast';

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
  roast: roastRouter,
  leaderboard: leaderboardRouter,
});

export type AppRouter = typeof appRouter;
