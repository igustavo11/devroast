import { createTRPCRouter } from '../init';
import { metricsRouter } from './metrics';

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
