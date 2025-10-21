import { text, varchar, timestamp, serial, pgTable } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const guidelines = pgTable('guidelines', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const guidelineSelectSchema = createSelectSchema(guidelines);
export type Guideline = z.infer<typeof guidelineSelectSchema>;
export const guidelineInsertSchema = createInsertSchema(guidelines);
export type GuidelineInsert = z.infer<typeof guidelineInsertSchema>;
