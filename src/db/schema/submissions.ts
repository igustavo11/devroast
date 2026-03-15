import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { languageEnum, roastModeEnum } from '../enums';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull(),
  language: languageEnum('language').notNull(),
  roastMode: roastModeEnum('roast_mode').notNull().default('roast'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
