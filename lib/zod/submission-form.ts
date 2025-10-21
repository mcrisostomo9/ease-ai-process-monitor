import { z } from 'zod';

export const submissionFormSchema = z.object({
  action: z
    .string()
    .min(1, 'Action is required')
    .min(10, 'Action must be at least 10 characters'),
  guideline: z
    .string()
    .min(1, 'Guideline is required')
    .min(10, 'Guideline must be at least 10 characters'),
});

export type SubmissionFormData = z.infer<typeof submissionFormSchema>;

export const classifySubmissionFormSchema = z.object({
  action: z
    .string()
    .min(1, 'Action is required')
    .min(10, 'Action must be at least 10 characters'),
  guidelineIds: z
    .array(z.number())
    .min(1, 'At least one guideline is required'),
});

export type ClassifySubmissionFormData = z.infer<
  typeof classifySubmissionFormSchema
>;
