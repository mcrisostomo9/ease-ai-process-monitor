import { db } from '@/db/drizzle';
import { guidelines as guidelinesTable } from '@/db/schemas/guidelines';
import { desc, inArray } from 'drizzle-orm';

export const getGuidelines = async () => {
  const result = await db
    .select()
    .from(guidelinesTable)
    .orderBy(desc(guidelinesTable.createdAt));

  return result;
};

export const getGuidelinesByIds = async (ids: number[]) => {
  if (ids.length === 0) return [];

  const result = await db
    .select()
    .from(guidelinesTable)
    .where(inArray(guidelinesTable.id, ids))
    .orderBy(desc(guidelinesTable.createdAt));

  return result;
};
