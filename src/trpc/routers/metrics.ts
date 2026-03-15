import { getMetricsSummary } from '@/db';
import { baseProcedure, createTRPCRouter } from '../init';

export const metricsRouter = createTRPCRouter({
  summary: baseProcedure.query(async () => {
    return await getMetricsSummary();
  }),
});
