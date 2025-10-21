import { z } from 'zod';

// Filter schemas
export const submissionFiltersSchema = z.object({
  // Text search filters
  action: z.string().optional(),
  guideline: z.string().optional(),

  // Enum filters
  result: z.enum(['complies', 'deviates', 'unclear']).optional(),

  // Numeric filters
  confidenceMin: z.number().min(0).max(1).optional(),
  confidenceMax: z.number().min(0).max(1).optional(),

  // Date filters
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),

  // Text search (searches across multiple fields)
  search: z.string().optional(),
});

// Sort schemas
export const submissionSortSchema = z.object({
  field: z.enum([
    'id',
    'action',
    'guideline',
    'result',
    'confidence',
    'timestamp',
    'createdAt',
  ]),
  direction: z.enum(['asc', 'desc']).default('desc'),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Combined query schema
export const submissionQuerySchema = z.object({
  filters: submissionFiltersSchema.optional(),
  sort: submissionSortSchema.optional(),
  pagination: paginationSchema.optional(),
});

// Type exports
export type SubmissionFilters = z.infer<typeof submissionFiltersSchema>;
export type SubmissionSort = z.infer<typeof submissionSortSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type SubmissionQuery = z.infer<typeof submissionQuerySchema>;
