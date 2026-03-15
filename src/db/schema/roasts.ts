import { pgTable, real, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { languageEnum, roastModeEnum } from '../enums';
import { submissions } from './submissions';

export const roasts = pgTable('roasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  score: real('score').notNull(),
  feedback: text('feedback').notNull(), // JSON array stored as text
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const feedbackItems = pgTable('feedback_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  roastId: uuid('roast_id')
    .notNull()
    .references(() => roasts.id, { onDelete: 'cascade' }),
  line: real('line').notNull(),
  column: real('column'),
  severity: text('severity').notNull(), // 'error', 'warning', 'info', 'suggestion'
  message: text('message').notNull(),
  category: text('category'), // 'security', 'performance', 'readability', 'best-practice', 'logic'
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
