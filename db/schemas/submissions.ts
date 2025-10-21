import {
  text,
  decimal,
  timestamp,
  serial,
  pgTable,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { guidelines } from './guidelines';

export const resultEnum = ['complies', 'deviates', 'unclear'] as const;
export type Result = (typeof resultEnum)[number];
export const complianceResultEnum = pgEnum('compliance_result', resultEnum);

export const submissions = pgTable('submissions', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  guidelineId: integer('guideline_id')
    .notNull()
    .references(() => guidelines.id),
  result: complianceResultEnum('result').notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 4 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const submissionSelectSchema = createSelectSchema(submissions);
export type Submission = z.infer<typeof submissionSelectSchema>;
export const submissionInsertSchema = createInsertSchema(submissions);
export type SubmissionInsert = z.infer<typeof submissionInsertSchema>;
