import { describe, it, expect } from 'vitest';
import {
  submissionFormSchema,
  classifySubmissionFormSchema,
  type SubmissionFormData,
  type ClassifySubmissionFormData,
} from '@/lib/zod/submission-form';

describe('submissionFormSchema', () => {
  it('should validate correct submission form data', () => {
    const validData = {
      action: 'Closed ticket #12345 with confirmation email',
      guideline: 'All tickets must be closed with confirmation email',
    };

    const result = submissionFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject empty action', () => {
    const invalidData = {
      action: '',
      guideline: 'All tickets must be closed with confirmation email',
    };

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Action is required');
    }
  });

  it('should reject action that is too short', () => {
    const invalidData = {
      action: 'Short',
      guideline: 'All tickets must be closed with confirmation email',
    };

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Action must be at least 10 characters',
      );
    }
  });

  it('should reject empty guideline', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
      guideline: '',
    };

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Guideline is required');
    }
  });

  it('should reject guideline that is too short', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
      guideline: 'Short',
    };

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Guideline must be at least 10 characters',
      );
    }
  });

  it('should reject missing fields', () => {
    const invalidData = {};

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues[0].message).toBe(
        'Invalid input: expected string, received undefined',
      );
      expect(result.error.issues[1].message).toBe(
        'Invalid input: expected string, received undefined',
      );
    }
  });

  it('should reject non-string values', () => {
    const invalidData = {
      action: 123,
      guideline: true,
    };

    const result = submissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
    }
  });

  it('should validate edge case with exactly 10 characters', () => {
    const validData = {
      action: '1234567890',
      guideline: '1234567890',
    };

    const result = submissionFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });
});

describe('classifySubmissionFormSchema', () => {
  it('should validate correct classify submission form data', () => {
    const validData = {
      action: 'Closed ticket #12345 with confirmation email',
      guidelineIds: [1, 2, 3],
    };

    const result = classifySubmissionFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should validate with single guideline ID', () => {
    const validData = {
      action: 'Closed ticket #12345 with confirmation email',
      guidelineIds: [1],
    };

    const result = classifySubmissionFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject empty action', () => {
    const invalidData = {
      action: '',
      guidelineIds: [1, 2, 3],
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Action is required');
    }
  });

  it('should reject action that is too short', () => {
    const invalidData = {
      action: 'Short',
      guidelineIds: [1, 2, 3],
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Action must be at least 10 characters',
      );
    }
  });

  it('should reject empty guidelineIds array', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
      guidelineIds: [],
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'At least one guideline is required',
      );
    }
  });

  it('should reject missing guidelineIds field', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Invalid input: expected array, received undefined',
      );
    }
  });

  it('should reject non-array guidelineIds', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
      guidelineIds: 'not an array',
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Invalid input: expected array, received string',
      );
    }
  });

  it('should reject guidelineIds with non-number elements', () => {
    const invalidData = {
      action: 'Closed ticket #12345 with confirmation email',
      guidelineIds: ['1', '2', '3'],
    };

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Invalid input: expected number, received string',
      );
    }
  });

  it('should reject missing fields', () => {
    const invalidData = {};

    const result = classifySubmissionFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);
      expect(result.error.issues[0].message).toBe(
        'Invalid input: expected string, received undefined',
      );
      expect(result.error.issues[1].message).toBe(
        'Invalid input: expected array, received undefined',
      );
    }
  });

  it('should validate edge case with exactly 10 characters for action', () => {
    const validData = {
      action: '1234567890',
      guidelineIds: [1],
    };

    const result = classifySubmissionFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });
});

describe('Type exports', () => {
  it('should export SubmissionFormData type', () => {
    const data: SubmissionFormData = {
      action: 'Test action',
      guideline: 'Test guideline',
    };

    expect(data.action).toBe('Test action');
    expect(data.guideline).toBe('Test guideline');
  });

  it('should export ClassifySubmissionFormData type', () => {
    const data: ClassifySubmissionFormData = {
      action: 'Test action',
      guidelineIds: [1, 2, 3],
    };

    expect(data.action).toBe('Test action');
    expect(data.guidelineIds).toEqual([1, 2, 3]);
  });
});
