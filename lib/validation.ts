import { z } from "zod"

export const submissionSchema = z.object({
  action: z.string().min(1, "Action is required").min(10, "Action must be at least 10 characters"),
  guideline: z.string().min(1, "Guideline is required").min(10, "Guideline must be at least 10 characters"),
})

export type SubmissionFormData = z.infer<typeof submissionSchema>
