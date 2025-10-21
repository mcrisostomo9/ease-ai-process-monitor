import { db } from '@/db/drizzle';
import {
  Result,
  submissionInsertSchema,
  submissions as submissionsTable,
} from '@/db/schemas/submissions';
import {
  guidelineInsertSchema,
  guidelines as guidelinesTable,
} from '@/db/schemas/guidelines';
import { desc, count, eq, and } from 'drizzle-orm';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SubmissionFilters {
  result?: Result | 'all';
}

export interface GetSubmissionsParams {
  pagination?: PaginationParams;
  filters?: SubmissionFilters;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SubmissionWithGuideline {
  id: number;
  action: string;
  guidelineId: number;
  result: Result;
  confidence: string;
  timestamp: Date;
  createdAt: Date;
  guideline: string;
}

export const getSubmissions = async (params?: GetSubmissionsParams) => {
  const page = params?.pagination?.page || 1;
  const limit = params?.pagination?.limit || 10;
  const offset = (page - 1) * limit;
  console.log(params?.filters?.result);
  const whereConditions = [];
  if (params?.filters?.result && params.filters.result !== 'all') {
    whereConditions.push(eq(submissionsTable.result, params.filters.result));
  }

  const submissionsPromise = db
    .select({
      id: submissionsTable.id,
      action: submissionsTable.action,
      guidelineId: submissionsTable.guidelineId,
      result: submissionsTable.result,
      confidence: submissionsTable.confidence,
      timestamp: submissionsTable.timestamp,
      createdAt: submissionsTable.createdAt,
      guideline: guidelinesTable.text,
    })
    .from(submissionsTable)
    .innerJoin(
      guidelinesTable,
      eq(submissionsTable.guidelineId, guidelinesTable.id),
    )
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(desc(submissionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  const totalCountPromise = db
    .select({ count: count() })
    .from(submissionsTable)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const [submissions, totalCountResult] = await Promise.all([
    submissionsPromise,
    totalCountPromise,
  ]);

  const totalCount = totalCountResult[0]?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data: submissions,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getLatestSubmission =
  async (): Promise<SubmissionWithGuideline | null> => {
    const result = await db
      .select({
        id: submissionsTable.id,
        action: submissionsTable.action,
        guidelineId: submissionsTable.guidelineId,
        result: submissionsTable.result,
        confidence: submissionsTable.confidence,
        timestamp: submissionsTable.timestamp,
        createdAt: submissionsTable.createdAt,
        guideline: guidelinesTable.text,
      })
      .from(submissionsTable)
      .innerJoin(
        guidelinesTable,
        eq(submissionsTable.guidelineId, guidelinesTable.id),
      )
      .orderBy(desc(submissionsTable.createdAt))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  };

export const createSubmission = async ({
  action,
  guideline,
  result,
  confidence,
}: {
  action: string;
  guideline: string;
  result: Result;
  confidence: number;
}) => {
  try {
    let guidelineRecord = await db
      .select()
      .from(guidelinesTable)
      .where(eq(guidelinesTable.text, guideline))
      .limit(1);

    let guidelineId: number;

    if (guidelineRecord.length === 0) {
      const parsedGuideline = guidelineInsertSchema.parse({
        name: guideline.substring(0, 255),
        text: guideline,
      });
      const [newGuideline] = await db
        .insert(guidelinesTable)
        .values(parsedGuideline)
        .returning();
      guidelineId = newGuideline.id;
    } else {
      guidelineId = guidelineRecord[0].id;
    }

    const parsedSubmission = submissionInsertSchema.parse({
      action,
      guidelineId,
      result,
      confidence: confidence.toString(),
    });

    const [submission] = await db
      .insert(submissionsTable)
      .values(parsedSubmission)
      .returning();

    return submission;
  } catch (error) {
    throw error;
  }
};
