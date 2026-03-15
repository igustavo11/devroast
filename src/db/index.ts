import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import type { RoastFeedback } from '@/types/roast';

const connectionString = process.env.DATABASE_URL ?? '';
const client = postgres(connectionString);
export const db = drizzle(client);

type SubmissionRow = {
  id: string;
  code: string;
  language: string;
  roast_mode: string;
  created_at: Date;
};

type RoastRow = {
  id: string;
  submission_id: string;
  score: number;
  feedback: RoastFeedback;
  summary: string;
  created_at: Date;
};

export async function createSubmission(params: {
  code: string;
  language: string;
  roastMode: 'brutal' | 'roast';
}): Promise<SubmissionRow> {
  const result = await db.execute(sql`
    INSERT INTO submissions (code, language, roast_mode)
    VALUES (${params.code}, ${params.language}, ${params.roastMode})
    RETURNING id, code, language, roast_mode, created_at
  `);
  return result[0] as SubmissionRow;
}

export async function createRoast(params: {
  submissionId: string;
  score: number;
  feedback: RoastFeedback;
  summary: string;
}): Promise<RoastRow> {
  const result = await db.execute(sql`
    INSERT INTO roasts (submission_id, score, feedback, summary)
    VALUES (${params.submissionId}, ${params.score}, ${JSON.stringify(params.feedback)}, ${params.summary})
    RETURNING id, submission_id, score, feedback, summary, created_at
  `);
  return result[0] as RoastRow;
}

type SubmissionWithRoastRow = {
  id: string;
  code: string;
  language: string;
  roast_mode: string;
  created_at: Date;
  roast_id: string | null;
  score: number | null;
  feedback: RoastFeedback | null;
  roast_summary: string | null;
  roast_created_at: Date | null;
};

export async function getSubmissionById(
  id: string,
): Promise<SubmissionWithRoastRow | null> {
  const result = await db.execute(sql`
    SELECT s.id, s.code, s.language, s.roast_mode, s.created_at,
           r.id as roast_id, r.score, r.feedback, r.summary as roast_summary, r.created_at as roast_created_at
    FROM submissions s
    LEFT JOIN roasts r ON r.submission_id = s.id
    WHERE s.id = ${id}
  `);
  return (result[0] as SubmissionWithRoastRow) || null;
}

type LeaderboardEntryRow = {
  submission_id: string;
  code_preview: string;
  language: string;
  roast_mode: string;
  created_at: Date;
  score: number;
  feedback: RoastFeedback;
  summary: string;
};

export async function getMetricsSummary(): Promise<{
  totalRoasts: number;
  avgScore: number;
}> {
  const result = await db.execute(sql`
    SELECT COUNT(*) as total, AVG(score) as avg_score FROM roasts
  `);
  const row = result[0] as { total: string; avg_score: string | null };
  return {
    totalRoasts: Number(row?.total || 0),
    avgScore: row?.avg_score ? Math.round(Number(row.avg_score) * 10) / 10 : 0,
  };
}

export async function getLeaderboard(params: {
  limit: number;
  offset: number;
}) {
  const { limit, offset } = params;

  const countResult = await db.execute(sql`
    SELECT COUNT(*) as total FROM roasts
  `);
  const total = Number(countResult[0]?.total || 0);

  const entries = await db.execute(sql`
    SELECT 
      s.id as submission_id,
      LEFT(s.code, 80) as code_preview,
      s.language,
      s.roast_mode,
      s.created_at,
      r.score,
      r.feedback,
      r.summary
    FROM submissions s
    INNER JOIN roasts r ON r.submission_id = s.id
    ORDER BY r.score ASC
    LIMIT ${limit} OFFSET ${offset}
  `);

  return {
    entries: entries.map((entry, index) => ({
      rank: offset + index + 1,
      submissionId: (entry as LeaderboardEntryRow).submission_id,
      codePreview: (entry as LeaderboardEntryRow).code_preview,
      language: (entry as LeaderboardEntryRow).language,
      roastMode: (entry as LeaderboardEntryRow).roast_mode,
      score: (entry as LeaderboardEntryRow).score,
      feedback: (entry as LeaderboardEntryRow).feedback,
      summary: (entry as LeaderboardEntryRow).summary,
      createdAt: (entry as LeaderboardEntryRow).created_at,
    })),
    total,
  };
}
